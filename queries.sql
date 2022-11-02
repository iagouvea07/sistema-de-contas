CREATE DATABASE server;

USE server;

CREATE TABLE cookies(usuario varchar(50), conteudo varchar(200));

CREATE TABLE usuarios(
    id int not null primary key auto_increment,
    nome varchar(50),
    email varchar(100),
    nascimento date,
    usuario varchar(50),
    senha varchar(60)
    );

CREATE TABLE lancamentos(
    id int not null primary key auto_increment,
    descricao varchar(50),
    valor varchar(10),
    data date
);

CREATE TABLE tipos_de_pagamentos(
    id int not null primary key auto_increment,
    nome varchar(50)
);

CREATE TRIGGER novo_cookie AFTER INSERT
ON usuarios
FOR EACH ROW
INSERT INTO cookies(usuario) VALUES (NEW.usuario);

