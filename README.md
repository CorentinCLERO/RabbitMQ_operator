# RabbitMQ Operator KUCA Brice, CLERO Corentin, TARRAF Fatat, SEILLON Quentin

Un système de calcul distribué utilisant RabbitMQ pour traiter des opérations mathématiques avec une interface web React.

## Description du projet

Ce projet démontre l'utilisation de RabbitMQ dans une architecture de microservices pour traiter des calculs mathématiques de manière distribuée. Le système permet de :

- **Envoyer des opérations** : Addition, soustraction, multiplication, division
- **Traitement distribué** : Chaque type d'opération est traité par un service dédié
- **Interface temps réel** : Visualisation des résultats via une interface React avec WebSocket
- **Gestion des messages** : Utilisation d'exchanges direct et fanout pour router les messages

### Fonctionnement

1. **Producer** génère des opérations mathématiques aléatoirement ou via l'interface web
2. **Exchange Direct** route les messages vers les bonnes queues selon l'opération
3. **Exchange Fanout** permet d'envoyer un message à tous les consumers (mode "all")
4. **Consumers** traitent les opérations et envoient les résultats à la queue "results"
5. **Consumer Results** collecte les résultats et les transmet via WebSocket
6. **Interface React** affiche les résultats en temps réel

![](image.png)

## Architecture

Le projet comprend plusieurs composants :

- **RabbitMQ** : Serveur de messages avec exchanges direct/fanout et queues spécialisées
- **Producer** : Service qui génère et envoie les tâches de calcul
- **Consumers Operators** : Services spécialisés pour chaque opération (add, sub, mul, div)
- **Consumer Results** : Service qui collecte les résultats et les transmet via WebSocket
- **WebSocket** : Serveur pour la communication temps réel avec l'interface web
- **React App** : Interface utilisateur web pour visualiser les résultats

## Prérequis

- Docker
- Docker Compose

## Installation et lancement

### 1. Cloner le projet

```bash
git clone https://github.com/CorentinCLERO/RabbitMQ_operator.git
cd RabbitMQ_operator
```

### 2. Installer les dépendances

```bash
npm install
```

> **Note** : Le fichier `.env` sera automatiquement créé à partir de `.env.example` lors de l'installation.

### 3. Lancer avec Docker Compose

#### Option 1 : Lancement complet (avec interface React)

```bash
docker-compose -f docker-compose-server.yaml up --build
```

#### Option 2 : Lancement des services avec un envoie de message aléatoirement toutes les 5 secondes environ

```bash
docker-compose up --build
```

## Accès aux services

### Interface Web

- **React App** : http://localhost:8080 (avec docker-compose-server.yaml)
- **WebSocket** : http://localhost:3000

### RabbitMQ Management

- **URL** : http://localhost:15672
- **Utilisateur** : user
- **Mot de passe** : password

## Commandes Docker utiles

### Arrêter les services

```bash
docker-compose down
```

### Arrêter et supprimer les volumes

```bash
docker-compose down -v
```

### Voir les logs

```bash
docker-compose logs -f
```

### Voir les logs d'un service spécifique

```bash
docker-compose logs -f [service-name]
```

Exemples :

- `docker-compose logs -f rabbitmq`
- `docker-compose logs -f producer`
- `docker-compose logs -f consumer-add`

### Reconstruire les images

```bash
docker-compose up --build
```

## Services disponibles

| Service          | Description                                | Port        |
| ---------------- | ------------------------------------------ | ----------- |
| rabbitmq         | Serveur RabbitMQ avec interface de gestion | 5672, 15672 |
| config           | Configuration des queues RabbitMQ          | -           |
| producer         | Générateur de tâches de calcul             | -           |
| consumer-add     | Consumer pour les additions                | -           |
| consumer-sub     | Consumer pour les soustractions            | -           |
| consumer-mul     | Consumer pour les multiplications          | -           |
| consumer-div     | Consumer pour les divisions                | -           |
| consumer-results | Collecteur de résultats                    | -           |
| websocket        | Serveur WebSocket pour l'interface         | 3000        |
| react            | Interface utilisateur React                | 8080        |

## Développement

### Lancer en mode développement

```bash
# Lancer seulement RabbitMQ
docker-compose up rabbitmq

node config/config.js

node consumer/consumer_operator.js add

node consumer/consumer_operator.js div

node consumer/consumer_operator.js mul

node consumer/consumer_operator.js sub

node consumer/consumer_operator.js all

node consumer/consumer_results.js

node producter/producer.js

```

penser à modifier l'url dans le .env pour mettre : `RABBITMQ_URL=amqp://user:password@localhost:5672`

### Structure du projet

```
RabbitMQ_operator/
├── config/           # Configuration des queues
├── consumer/         # Services consumers
├── producer/         # Service producer
├── websocket/        # Serveur WebSocket
├── react-app/        # Interface React
├── constants/        # Constantes partagées
└── scripts/          # Scripts utilitaires
```
