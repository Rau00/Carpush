<?php
require_once __DIR__ . '/../config/database.php';

function getUserByToken(): ?array {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!str_starts_with($auth, 'Bearer ')) return null;
    $token = substr($auth, 7);
    $stmt  = getDB()->prepare(
        'SELECT u.id, u.nombre, u.email, u.rol
         FROM auth_tokens t JOIN usuarios u ON t.usuario_id = u.id
         WHERE t.token = ?'
    );
    $stmt->execute([$token]);
    return $stmt->fetch() ?: null;
}

function requireAuth(): array {
    $user = getUserByToken();
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'No autenticado']);
        exit;
    }
    return $user;
}
