<?php
// Permitir cookies de sesión entre localhost:3000 (PHP) y localhost:5173 (React),
// necesario para el paso de datos.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

$allowed = ['http://localhost:5173', 'http://127.0.0.1:5173'];

if (in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: http://localhost:5173");
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// Responder preflight OPTIONS y terminar
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Configurar sesión ANTES de session_start para que funcione cross-origin
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', '0');    // 0 porque estamos en HTTP local
ini_set('session.cookie_httponly', '1');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
