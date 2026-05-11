DROP DATABASE IF EXISTS carpush;

CREATE DATABASE IF NOT EXISTS carpush CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE carpush;


-- Tabla: usuarios

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('cliente', 'admin') DEFAULT 'cliente',
    avatar VARCHAR(255) DEFAULT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- Tabla: marcas

CREATE TABLE IF NOT EXISTS marcas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    logo_url VARCHAR(255) DEFAULT NULL,
    pais_origen VARCHAR(100) DEFAULT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- Tabla: coches

CREATE TABLE IF NOT EXISTS coches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca_id INT NOT NULL,
    modelo VARCHAR(150) NOT NULL,
    tipo ENUM('SUV', 'Deportivo', '4x4') NOT NULL,
    anio YEAR NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    kilometros INT DEFAULT 0,
    color VARCHAR(80) DEFAULT NULL,
    descripcion TEXT DEFAULT NULL,
    imagen_url VARCHAR(255) DEFAULT NULL,
    disponible TINYINT(1) DEFAULT 1,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (marca_id) REFERENCES marcas(id) ON DELETE CASCADE,
    INDEX idx_marca (marca_id),
    INDEX idx_tipo (tipo),
    INDEX idx_disponible (disponible)
) ENGINE=InnoDB;

-- Favoritos
CREATE TABLE IF NOT EXISTS favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    coche_id   INT NOT NULL,
    creado_en  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (coche_id)   REFERENCES coches(id)   ON DELETE CASCADE,
    UNIQUE KEY uq_fav (usuario_id, coche_id)
) ENGINE=InnoDB;
 
-- Carrito
CREATE TABLE IF NOT EXISTS carrito (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    coche_id   INT NOT NULL,
    creado_en  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (coche_id)   REFERENCES coches(id)   ON DELETE CASCADE,
    UNIQUE KEY uq_carrito (usuario_id, coche_id)
) ENGINE=InnoDB;
 
-- Facturas
CREATE TABLE IF NOT EXISTS pedidos (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id       INT NOT NULL,
    coche_id         INT NOT NULL,
    marca_nombre     VARCHAR(100) NOT NULL,
    modelo           VARCHAR(150) NOT NULL,
    precio           DECIMAL(10,2) NOT NULL,
    nombre_comprador VARCHAR(150) NOT NULL,
    email_comprador  VARCHAR(150) NOT NULL,
    telefono         VARCHAR(30)  DEFAULT NULL,
    direccion        TEXT         DEFAULT NULL,
    creado_en        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- DATOS INICIALES: Marcas


INSERT INTO marcas (nombre, pais_origen) VALUES
('Toyota',       'Japón'),
('BMW',          'Alemania'),
('Mercedes-Benz','Alemania'),
('Audi',         'Alemania'),
('Ford',         'Estados Unidos'),
('Volkswagen',   'Alemania'),
('Honda',        'Japón'),
('Nissan',       'Japón'),
('Porsche',      'Alemania'),
('Land Rover',   'Reino Unido'),
('Ferrari',      'Italia'),
('Lamborghini',  'Italia'),
('Jeep',         'Estados Unidos'),
('Hyundai',      'Corea del Sur'),
('Kia',          'Corea del Sur');

-- Toyota
INSERT INTO coches (marca_id, modelo, tipo, anio, precio, kilometros, color, descripcion, imagen_url) VALUES
(1, 'RAV4',       'SUV',       2023, 32500.00,  15000, 'Blanco',  'Toyota RAV4 híbrido, eficiente y espacioso.', 'toyotarav4.png'),
(1, 'GR86',       'Deportivo', 2023, 29900.00,   8000, 'Amarillo',    'Deportivo ligero con motor bóxer 2.4L.', 'toyotaGR86.png'),
(1, 'Land Cruiser','4x4',      2022, 68000.00,  22000, 'Gris Carbón Azulado',    'Referente en todo terreno, fiabilidad extrema.', 'toyotaLandCruiser.png');

-- BMW
INSERT INTO coches (marca_id, modelo, tipo, anio, precio, kilometros, color, descripcion, imagen_url) VALUES
(2, 'X5',         'SUV',       2023, 75000.00,  10000, 'Gris',   'BMW X5 xDrive45e, lujo y tecnología.', 'BMWX5.png'),
(2, 'M4 Competition','Deportivo',2022,89000.00,  5000, 'Azul',    'M4 con 510 CV, el deportivo definitivo.', 'BMWM4.png'),
(2, 'X3 M',       '4x4',       2023, 72000.00,  12000, 'Gris',  'Tracción integral con prestaciones M.', 'BMWX3.png');

-- Mercedes-Benz
INSERT INTO coches (marca_id, modelo, tipo, anio, precio, kilometros, color, descripcion, imagen_url) VALUES
(3, 'GLE',        'SUV',       2023, 82000.00,   9000, 'Blanco',   'Elegancia y confort máximo en SUV.', 'Mercedes-BenzGLE.png'),
(3, 'AMG GT',     'Deportivo', 2022,145000.00,   3000, 'Gris',   'AMG GT 63 S, 639 CV de pura ingeniería.', 'Mercedes-BenzAMG-GT.png'),
(3, 'Clase G',    '4x4',       2023,145000.00,   7000, 'Gris',   'El icónico Geländewagen, indestructible.', 'Mercedes-Benz-Clase-G.png');

-- Audi
INSERT INTO coches (marca_id, modelo, tipo, anio, precio, kilometros, color, descripcion, imagen_url) VALUES
(4, 'Q7',         'SUV',       2023, 78000.00,  11000, 'Negro',    'SUV premium de 7 plazas con quattro.', 'AudiQ7.png'),
(4, 'RS5',        'Deportivo', 2022, 95000.00,   6000, 'Azul',    'RS5 Sportback, 450 CV quattro.', 'AudiRS5.png'),
(4, 'Q5 40 TDI',  '4x4',       2023, 55000.00,  18000, 'Blanco',  'Versatilidad quattro para cualquier terreno.', 'AudiQ540TDI.png');

-- Ford
INSERT INTO coches (marca_id, modelo, tipo, anio, precio, kilometros, color, descripcion, imagen_url) VALUES
(5, 'Explorer',   'SUV',       2022, 48000.00,  25000, 'Blanco',    'Ford Explorer híbrido enchufable, familiar.', 'FordExplorer.png'),
(5, 'Mustang GT', 'Deportivo', 2023, 55000.00,   4000, 'Rojo','V8 5.0L, 450 CV, leyenda americana.', 'FordMustangGT.png'),
(5, 'Bronco',     '4x4',       2023, 45000.00,  12000, 'Gris', 'Aventura pura, tracción 4x4 de serie.', 'FordBronco.png');

-- Volkswagen
INSERT INTO coches (marca_id, modelo, tipo, anio, precio, kilometros, color, descripcion, imagen_url) VALUES
(6, 'Tiguan',     'SUV',       2023, 38000.00,  14000, 'Gris',    'Tiguan Allspace 4Motion, 7 plazas.', 'VolkswagenTiguan.png'),
(6, 'Golf GTI',   'Deportivo', 2023, 42000.00,   7000, 'Gris',  'GTI Clubsport, 300 CV tracción delantera.', 'VolkswagenGolfGTI.png'),
(6, 'Touareg R',  '4x4',       2022, 88000.00,  16000, 'Negro',   'PHEV con AWD, lujo y capacidad off-road.', 'VolkswagenTouaregR.png');

-- Honda
INSERT INTO coches (marca_id, modelo, tipo, anio, precio, kilometros, color, descripcion, imagen_url) VALUES
(7, 'CR-V',       'SUV',       2023, 35000.00,  10000, 'Blanco',   'CR-V e:HEV, híbrido eficiente y práctico.', 'HondaCR-V.png'),
(7, 'Civic Type R','Deportivo',2023, 48000.00,   3000, 'Azul',    'FK8 con 329 CV, el hot hatch definitivo.', 'HondaCivicTypeR.png'),
(7, 'Passport',   '4x4',       2022, 40000.00,  20000, 'Negro',    'Tracción AWD, diseño robusto y confiable.', 'HondaPassport.png');

-- Nissan
INSERT INTO coches (marca_id, modelo, tipo, anio, precio, kilometros, color, descripcion, imagen_url) VALUES
(8, 'Qashqai',    'SUV',       2023, 30000.00,  18000, 'Gris',    'Qashqai e-Power, eficiencia sin enchufe.', 'NissanQashqai.png'),
(8, 'GT-R',       'Deportivo', 2020,115000.00,   9000, 'Blanco',  'Godzilla: 570 CV AWD, leyenda japonesa.', 'NissanGT-R.png'),
(8, 'Pathfinder', '4x4',       2022, 45000.00,  22000, 'Blanco',  'Tracción 4WD, 7 plazas, aventura familiar.', 'NissanPathfinder.png');

-- Porsche
INSERT INTO coches (marca_id, modelo, tipo, anio, precio, kilometros, color, descripcion, imagen_url) VALUES
(9, 'Cayenne',    'SUV',       2023,102000.00,   8000, 'Blanco',   'Cayenne E-Hybrid, el SUV deportivo.', 'PorscheCayenne.png'),
(9, '911 Carrera','Deportivo', 2023,130000.00,   2000, 'Rojo',    '911 Carrera 4S, icono intemporal.', 'Porsche911Carrera.png'),
(9, 'Macan S',    '4x4',       2022, 72000.00,  14000, 'Rojo',   'Macan con AWD, conducción dinámica.', 'PorscheMacanS.png');

-- Land Rover
INSERT INTO coches (marca_id, modelo, tipo, anio, precio, kilometros, color, descripcion, imagen_url) VALUES
(10,'Discovery',  'SUV',       2022, 72000.00,  19000, 'Gris',   'Discovery D300, 7 plazas, versatilidad total.', 'LandRoverDiscovery.png'),
(10,'Range Rover Velar','Deportivo',2023,82000.00,6000, 'Blanco', 'Diseño vanguardista, potencia y elegancia.', 'LandRoverRangeRoverVelar.png'),
(10,'Defender 110','4x4',      2023, 89000.00,  10000, 'Gris Oliva', 'El todoterreno más icónico del mundo.', 'LandRoverDefender110.png');

-- Ferrari
INSERT INTO coches (marca_id, modelo, tipo, anio, precio, kilometros, color, descripcion, imagen_url) VALUES
(11,'Purosangue', 'SUV',       2023,400000.00,   1000, 'Vino Tinto',    'El primer SUV Ferrari, V12 naturalmente aspirado.', 'FerrariPurosangue.png'),
(11,'F8 Tributo', 'Deportivo', 2021,280000.00,   4000, 'Rojo','V8 biturbo 720 CV, sucesor del 488.', 'FerrariF8Tributo.png'),
(11,'812 GTS',    'Deportivo', 2022,380000.00,   2000, 'Rojo',   '812 GTS spider, V12 800 CV, aire puro.', 'Ferrari812GTS.png');

-- Lamborghini
INSERT INTO coches (marca_id, modelo, tipo, anio, precio, kilometros, color, descripcion, imagen_url) VALUES
(12,'Urus',       'SUV',       2022,230000.00,   5000, 'Blanco',   'El super SUV: V8 biturbo 650 CV AWD.', 'LamborghiniUrus.png'),
(12,'Huracán EVO','Deportivo', 2021,250000.00,   3000, 'Marrón ámbar',   'V10 aspirado 640 CV, la esencia Lamborghini.', 'LamborghiniHuracanEVO.png'),
(12,'Urus S',     '4x4',       2023,260000.00,   2000, 'Gris', 'Urus S con AWD mejorado y 666 CV.', 'LamborghiniUrusS.png');

-- Jeep
INSERT INTO coches (marca_id, modelo, tipo, anio, precio, kilometros, color, descripcion, imagen_url) VALUES
(13,'Grand Cherokee','SUV',    2023, 62000.00,  13000, 'Blanco',    'Grand Cherokee 4xe PHEV, lujo y capacidad.', 'JeepGrandCherokee.png'),
(13,'Wrangler',   'Deportivo', 2023, 50000.00,   8000, 'Rojo','Rubicon 4xe enchufable, icono off-road.', 'JeepWrangler.png'),
(13,'Gladiator',  '4x4',       2022, 48000.00,  17000, 'Gris',    'Pickup con capacidades Wrangler, única en su clase.', 'JeepGladiator.png');

-- Hyundai
INSERT INTO coches (marca_id, modelo, tipo, anio, precio, kilometros, color, descripcion, imagen_url) VALUES
(14,'Tucson',     'SUV',       2023, 32000.00,  11000, 'Blanco',    'Tucson PHEV, diseño paramétrico innovador.', 'HyundaiTucson.png'),
(14,'IONIQ 6',    'Deportivo', 2023, 44000.00,   5000, 'Blanco',  'Eléctrico aerodinámico, 0-100 en 3.4s.', 'HyundaiIONIQ6.png'),
(14,'Santa Fe',   '4x4',       2022, 38000.00,  20000, 'Blanco',    'Santa Fe AWD, familiar y capaz en cualquier terreno.', 'HyundaiSantaFe.png');

-- Kia
INSERT INTO coches (marca_id, modelo, tipo, anio, precio, kilometros, color, descripcion, imagen_url) VALUES
(15,'Sportage',   'SUV',       2023, 30000.00,  14000, 'Blanco',   'Sportage PHEV, diseño futurista y eficiencia.', 'KiaSportage.png'),
(15,'Stinger GT', 'Deportivo', 2022, 42000.00,  10000, 'Rojo',    'V6 3.3T 366 CV, gran turismo coreano.', 'KiaStingerGT.png'),
(15,'Sorento',    '4x4',       2023, 40000.00,  16000, 'Azul',   'Sorento AWD 7 plazas, polivalencia total.', 'KiaSorento.png');


-- Usuarios por defecto

-- Email: admin@carpush.com | Contraseña: admin123
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (
  'Administrador',
  'admin@carpush.com',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password
  'admin'
) ON DUPLICATE KEY UPDATE rol = 'admin';
 

-- Email: usuario@carpush.com | Contraseña: usuario123
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (
  'Usuario Demo',
  'usuario@carpush.com',
  '$2y$10$TKh8H1.PpuAi4TB0DhLV5ODdntXKA2L3frHkeSFp3V1pKumgbPaYy', -- usuario123
  'cliente'
) ON DUPLICATE KEY UPDATE rol = 'cliente';
