<?php
require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth_token.php';

$user   = requireAuth();
$userId = (int)$user['id'];
$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;
$body   = json_decode(file_get_contents('php://input'), true) ?? [];

if      ($method === 'GET')    getFavoritos($userId);
elseif  ($method === 'POST')   addFavorito($userId, $body);
elseif  ($method === 'DELETE') removeFavorito($userId, $id);

function getFavoritos(int $userId): void {
    $stmt = getDB()->prepare(
        'SELECT f.id AS favorito_id, c.*, m.nombre AS marca_nombre
         FROM favoritos f JOIN coches c ON f.coche_id=c.id JOIN marcas m ON c.marca_id=m.id
         WHERE f.usuario_id=? ORDER BY f.creado_en DESC'
    );
    $stmt->execute([$userId]);
    echo json_encode(['data' => $stmt->fetchAll()]);
}

function addFavorito(int $userId, array $body): void {
    $cocheId = (int)($body['coche_id'] ?? 0);
    if (!$cocheId) { http_response_code(422); echo json_encode(['error' => 'coche_id requerido']); return; }
    try {
        getDB()->prepare('INSERT INTO favoritos (usuario_id,coche_id) VALUES (?,?)')->execute([$userId,$cocheId]);
        http_response_code(201);
        echo json_encode(['message' => 'Añadido a favoritos']);
    } catch (PDOException) {
        http_response_code(409);
        echo json_encode(['error' => 'Ya está en favoritos']);
    }
}

function removeFavorito(int $userId, ?int $favId): void {
    if (!$favId) { http_response_code(400); echo json_encode(['error' => 'ID requerido']); return; }
    getDB()->prepare('DELETE FROM favoritos WHERE id=? AND usuario_id=?')->execute([$favId,$userId]);
    echo json_encode(['message' => 'Eliminado']);
}
