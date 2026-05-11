<?php
require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/database.php';

// Crear tabla de tokens si no existe
getDB()->exec("
    CREATE TABLE IF NOT EXISTS auth_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        token VARCHAR(64) NOT NULL UNIQUE,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    ) ENGINE=InnoDB
");

$action = $_GET['action'] ?? '';
$body   = json_decode(file_get_contents('php://input'), true) ?? [];

switch ($action) {
    case 'register': handleRegister($body); break;
    case 'login':    handleLogin($body);    break;
    case 'logout':   handleLogout();        break;
    case 'me':       handleMe();            break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Acción no válida']);
}

function getTokenFromRequest(): ?string {
    // El token viene en la cabecera Authorization: Bearer <token>
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (str_starts_with($auth, 'Bearer ')) {
        return substr($auth, 7);
    }
    return null;
}

function getUserByToken(): ?array {
    $token = getTokenFromRequest();
    if (!$token) return null;
    $stmt = getDB()->prepare(
        'SELECT u.id, u.nombre, u.email, u.rol
         FROM auth_tokens t JOIN usuarios u ON t.usuario_id = u.id
         WHERE t.token = ?'
    );
    $stmt->execute([$token]);
    return $stmt->fetch() ?: null;
}

function handleRegister(array $data): void {
    $nombre   = trim($data['nombre']   ?? '');
    $email    = trim($data['email']    ?? '');
    $password = trim($data['password'] ?? '');

    if (!$nombre || !$email || !$password) {
        http_response_code(422);
        echo json_encode(['error' => 'Todos los campos son obligatorios']);
        return;
    }

    $pdo = getDB();
    $check = $pdo->prepare('SELECT id FROM usuarios WHERE email = ?');
    $check->execute([$email]);
    if ($check->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Ya existe una cuenta con ese email']);
        return;
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);
    $pdo->prepare('INSERT INTO usuarios (nombre, email, password_hash) VALUES (?,?,?)')->execute([$nombre, $email, $hash]);
    $id = $pdo->lastInsertId();

    $token = bin2hex(random_bytes(32));
    $pdo->prepare('INSERT INTO auth_tokens (usuario_id, token) VALUES (?,?)')->execute([$id, $token]);

    http_response_code(201);
    echo json_encode([
        'token'   => $token,
        'usuario' => ['id' => $id, 'nombre' => $nombre, 'email' => $email, 'rol' => 'cliente'],
    ]);
}

function handleLogin(array $data): void {
    $email    = trim($data['email']    ?? '');
    $password = trim($data['password'] ?? '');

    if (!$email || !$password) {
        http_response_code(422);
        echo json_encode(['error' => 'Email y contraseña obligatorios']);
        return;
    }

    $pdo  = getDB();
    $stmt = $pdo->prepare('SELECT id, nombre, email, password_hash, rol FROM usuarios WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Credenciales incorrectas']);
        return;
    }

    // Eliminar tokens anteriores del usuario y crear uno nuevo
    $pdo->prepare('DELETE FROM auth_tokens WHERE usuario_id = ?')->execute([$user['id']]);
    $token = bin2hex(random_bytes(32));
    $pdo->prepare('INSERT INTO auth_tokens (usuario_id, token) VALUES (?,?)')->execute([$user['id'], $token]);

    echo json_encode([
        'token'   => $token,
        'usuario' => ['id' => $user['id'], 'nombre' => $user['nombre'], 'email' => $user['email'], 'rol' => $user['rol']],
    ]);
}

function handleLogout(): void {
    $token = getTokenFromRequest();
    if ($token) {
        getDB()->prepare('DELETE FROM auth_tokens WHERE token = ?')->execute([$token]);
    }
    echo json_encode(['message' => 'Sesión cerrada']);
}

function handleMe(): void {
    $user = getUserByToken();
    if (!$user) {
        echo json_encode(['autenticado' => false]);
        return;
    }
    echo json_encode(['autenticado' => true, 'usuario' => $user]);
}
