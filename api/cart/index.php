<?php
require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth_token.php';

$user   = requireAuth();
$userId = (int)$user['id'];
$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;
$body   = json_decode(file_get_contents('php://input'), true) ?? [];

if      ($method === 'GET')    
    getCarrito($userId);
elseif  ($method === 'POST')   
    addCarrito($userId, $body);
elseif  ($method === 'DELETE') 
    removeCarrito($userId, $id);

function getCarrito(int $userId): void {
    $stmt = getDB()->prepare(
        'SELECT ca.id AS carrito_id, c.*, m.nombre AS marca_nombre
         FROM carrito ca JOIN coches c ON ca.coche_id=c.id JOIN marcas m ON c.marca_id=m.id
         WHERE ca.usuario_id=? ORDER BY ca.creado_en DESC'
    );
    $stmt->execute([$userId]);
    $items = $stmt->fetchAll();
    echo json_encode(['data' => $items, 'total' => array_sum(array_column($items,'precio'))]);
}

function addCarrito(int $userId, array $body): void {
    $cocheId = (int)($body['coche_id'] ?? 0);
    if (!$cocheId) { http_response_code(422); echo json_encode(['error' => 'coche_id requerido']); return; }
    try {
        getDB()->prepare('INSERT INTO carrito (usuario_id,coche_id) VALUES (?,?)')->execute([$userId,$cocheId]);
        http_response_code(201);
        echo json_encode(['message' => 'Añadido al carrito']);
    } catch (PDOException) {
        http_response_code(409);
        echo json_encode(['error' => 'Ya está en el carrito']);
    }
}

function removeCarrito(int $userId, ?int $carritoId): void {
    if (!$carritoId) { http_response_code(400); echo json_encode(['error' => 'ID requerido']); return; }
    getDB()->prepare('DELETE FROM carrito WHERE id=? AND usuario_id=?')->execute([$carritoId,$userId]);
    echo json_encode(['message' => 'Eliminado']);
}
