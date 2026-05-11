<?php
require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;

$body = json_decode(file_get_contents('php://input'), true) ?? [];

if ($method === 'GET') {
    if ($action === 'marcas') {
        getMarcas();
    } elseif ($id) {
        getCocheById($id);
    } else {
        getCoches();
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}

function getCoches(): void {
    $pdo    = getDB();
    $where  = ['1=1'];
    $params = [];

    if (!empty($_GET['marca_id'])) {
        $where[]  = 'c.marca_id = ?';
        $params[] = (int)$_GET['marca_id'];
    }
    if (!empty($_GET['tipo'])) {
        $where[]  = 'c.tipo = ?';
        $params[] = $_GET['tipo'];
    }
    if (!empty($_GET['precio_max'])) {
        $where[]  = 'c.precio <= ?';
        $params[] = (float)$_GET['precio_max'];
    }
    if (!empty($_GET['q'])) {
        $where[]  = '(c.modelo LIKE ? OR m.nombre LIKE ? OR c.descripcion LIKE ?)';
        $q        = '%' . $_GET['q'] . '%';
        $params[] = $q; $params[] = $q; $params[] = $q;
    }

    $sql  = 'SELECT c.*, m.nombre AS marca_nombre FROM coches c JOIN marcas m ON c.marca_id = m.id WHERE ' . implode(' AND ', $where) . ' ORDER BY c.id ASC';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $coches = $stmt->fetchAll();

    echo json_encode(['data' => $coches, 'total' => count($coches)]);
}

function getCocheById(int $id): void {
    $pdo  = getDB();
    $stmt = $pdo->prepare('SELECT c.*, m.nombre AS marca_nombre FROM coches c JOIN marcas m ON c.marca_id = m.id WHERE c.id = ?');
    $stmt->execute([$id]);
    $coche = $stmt->fetch();

    if (!$coche) {
        http_response_code(404);
        echo json_encode(['error' => 'Coche no encontrado']);
        return;
    }
    echo json_encode(['data' => $coche]);
}

function getMarcas(): void {
    $pdo  = getDB();
    $stmt = $pdo->query('SELECT * FROM marcas ORDER BY nombre ASC');
    echo json_encode(['data' => $stmt->fetchAll()]);
}
