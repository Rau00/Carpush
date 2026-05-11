<?php
require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth_token.php';

$user   = requireAuth();
$userId = (int)$user['id'];
$method = $_SERVER['REQUEST_METHOD'];
$body   = json_decode(file_get_contents('php://input'), true) ?? [];

if      ($method === 'GET')  getPedidos($userId);
elseif  ($method === 'POST') checkout($userId, $body);

function getPedidos(int $userId): void {
    $stmt = getDB()->prepare('SELECT * FROM pedidos WHERE usuario_id=? ORDER BY creado_en DESC');
    $stmt->execute([$userId]);
    echo json_encode(['data' => $stmt->fetchAll()]);
}

function checkout(int $userId, array $body): void {
    $cocheId   = (int)($body['coche_id']  ?? 0);
    $nombre    = trim($body['nombre']     ?? '');
    $email     = trim($body['email']      ?? '');
    $telefono  = trim($body['telefono']   ?? '');
    $direccion = trim($body['direccion']  ?? '');

    if (!$cocheId || !$nombre || !$email) {
        http_response_code(422);
        echo json_encode(['error' => 'coche_id, nombre y email son obligatorios']);
        return;
    }

    $pdo = getDB();
    $st  = $pdo->prepare('SELECT c.*,m.nombre AS marca_nombre FROM coches c JOIN marcas m ON c.marca_id=m.id WHERE c.id=?');
    $st->execute([$cocheId]);
    $coche = $st->fetch();

    if (!$coche) { http_response_code(404); echo json_encode(['error' => 'Coche no encontrado']); return; }

    $pdo->prepare(
        'INSERT INTO pedidos (usuario_id,coche_id,marca_nombre,modelo,precio,nombre_comprador,email_comprador,telefono,direccion)
         VALUES (?,?,?,?,?,?,?,?,?)'
    )->execute([$userId,$cocheId,$coche['marca_nombre'],$coche['modelo'],$coche['precio'],$nombre,$email,$telefono?:null,$direccion?:null]);

    $pedidoId = $pdo->lastInsertId();
    $pdo->prepare('DELETE FROM carrito WHERE usuario_id=? AND coche_id=?')->execute([$userId,$cocheId]);

    $f = $pdo->prepare('SELECT * FROM pedidos WHERE id=?');
    $f->execute([$pedidoId]);

    http_response_code(201);
    echo json_encode(['message' => 'Compra realizada', 'factura' => $f->fetch()]);
}
