<?php
require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth_token.php';

// Solo administradores
$user = getUserByToken();
if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'No autenticado']);
    exit;
}
if ($user['rol'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Acceso denegado. Se requiere rol admin.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;
$body   = json_decode(file_get_contents('php://input'), true) ?? [];

switch ($method) {
    case 'GET':    listarCoches();          break;
    case 'POST':   crearCoche($body);       break;
    case 'PUT':    editarCoche($id, $body); break;
    case 'DELETE': borrarCoche($id);        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}

function listarCoches(): void {
    $pdo  = getDB();
    $stmt = $pdo->query(
        'SELECT c.*, m.nombre AS marca_nombre
         FROM coches c JOIN marcas m ON c.marca_id = m.id
         ORDER BY c.id DESC'
    );
    echo json_encode(['data' => $stmt->fetchAll()]);
}

function crearCoche(array $data): void {
    $campos = ['marca_id','modelo','tipo','anio','precio'];
    foreach ($campos as $campo) {
        if (empty($data[$campo])) {
            http_response_code(422);
            echo json_encode(['error' => "El campo '$campo' es obligatorio."]);
            return;
        }
    }

    if (!in_array($data['tipo'], ['SUV','Deportivo','4x4'])) {
        http_response_code(422);
        echo json_encode(['error' => 'Tipo debe ser SUV, Deportivo o 4x4.']);
        return;
    }

    $pdo = getDB();

    // Verificar que la marca existe
    $m = $pdo->prepare('SELECT id FROM marcas WHERE id = ?');
    $m->execute([(int)$data['marca_id']]);
    if (!$m->fetch()) {
        http_response_code(422);
        echo json_encode(['error' => 'Marca no encontrada.']);
        return;
    }

    $pdo->prepare(
        'INSERT INTO coches (marca_id, modelo, tipo, anio, precio, kilometros, color, descripcion, imagen_url, disponible)
         VALUES (?,?,?,?,?,?,?,?,?,?)'
    )->execute([
        (int)$data['marca_id'],
        trim($data['modelo']),
        $data['tipo'],
        (int)$data['anio'],
        (float)$data['precio'],
        (int)($data['kilometros'] ?? 0),
        trim($data['color']       ?? ''),
        trim($data['descripcion'] ?? ''),
        trim($data['imagen_url']  ?? ''),
        1,
    ]);

    $id   = $pdo->lastInsertId();
    $stmt = $pdo->prepare('SELECT c.*, m.nombre AS marca_nombre FROM coches c JOIN marcas m ON c.marca_id=m.id WHERE c.id=?');
    $stmt->execute([$id]);

    http_response_code(201);
    echo json_encode(['message' => 'Coche creado correctamente.', 'data' => $stmt->fetch()]);
}

function editarCoche(?int $id, array $data): void {
    if (!$id) { http_response_code(400); echo json_encode(['error' => 'ID requerido.']); return; }

    $pdo   = getDB();
    $check = $pdo->prepare('SELECT id FROM coches WHERE id = ?');
    $check->execute([$id]);
    if (!$check->fetch()) {
        http_response_code(404);
        echo json_encode(['error' => 'Coche no encontrado.']);
        return;
    }

    $permitidos = ['marca_id','modelo','tipo','anio','precio','kilometros','color','descripcion','imagen_url','disponible'];
    $sets = []; $params = [];
    foreach ($permitidos as $campo) {
        if (array_key_exists($campo, $data)) {
            $sets[]   = "$campo = ?";
            $params[] = $data[$campo];
        }
    }

    if (empty($sets)) { http_response_code(400); echo json_encode(['error' => 'Nada que actualizar.']); return; }

    $params[] = $id;
    $pdo->prepare('UPDATE coches SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($params);

    echo json_encode(['message' => 'Coche actualizado correctamente.']);
}

function borrarCoche(?int $id): void {
    if (!$id) { http_response_code(400); echo json_encode(['error' => 'ID requerido.']); return; }

    $stmt = getDB()->prepare('DELETE FROM coches WHERE id = ?');
    $stmt->execute([$id]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Coche no encontrado.']);
        return;
    }

    echo json_encode(['message' => 'Coche eliminado correctamente.']);
}