# Kubernetes Microservices Monitoring Assignment

## Overview

This project implements a microservices-based Node.js system deployed on Kubernetes.
It processes CPU-intensive jobs using a Redis queue, scales workers using HPA, and provides monitoring via Prometheus and Grafana.

---

## Architecture

### Services

### Service A: Job API

- Endpoints:
  - `POST /api/submit` → submit a job
  - `GET /api/status/:id` → check job status

- Pushes jobs to Redis queue
- Returns jobId

---

### Service B: Worker

- Consumes jobs from Redis
- Performs CPU-intensive tasks:
  - Prime number calculation
  - bcrypt hashing
  - Array sorting

- Stores results in Redis
- Exposes `/metrics` for Prometheus

---

### Service C: Stats Service

- Endpoint:
  - `GET /api/stats`

- Provides:
  - total jobs submitted
  - total jobs completed
  - queue length
  - average processing time

- Exposes `/metrics`

---

### Redis

- Used as queue + storage for job status and results

---

## Kubernetes Setup

### Resources Used

- Deployments (job-api, worker, stats-service, redis)
- Services:
  - job-api → LoadBalancer
  - worker, stats-service → ClusterIP

- Ingress:
  - Host: `job.local`

- HPA:
  - Worker scales from 2 to 10 pods when CPU > 70%

---

## How to Run (Minikube)

### 1. Start cluster

```
minikube start
minikube addons enable ingress
minikube addons enable metrics-server
```

---

### 2. Build images inside Minikube

```
minikube -p minikube docker-env | Invoke-Expression

docker build -t job-api -f ./apps/job-api/Dockerfile .
docker build -t worker-service -f ./apps/worker-service/Dockerfile .
docker build -t stats-service -f ./apps/stats-service/Dockerfile .
```

---

### 3. Apply Kubernetes files

```
kubectl apply -f k8s/
```

---

### 4. Enable access via Ingress

Add in hosts file:

```
127.0.0.1 job.local
```

Run:

```
minikube tunnel
```

---

## API Usage

### Submit Job

```
POST http://job.local/api/submit
```

Body:

```
{
  "type": "prime",
  "payload": { "limit": 10000 }
}
```

---

### Check Status

```
GET http://job.local/api/status/<jobId>
```

---

### Invalid Job ID

```
GET http://job.local/api/status/fake-id
```

Response:

```
{
  "error": "Job not found"
}
```

---

## Monitoring

### Prometheus

```
kubectl port-forward svc/prometheus-kube-prometheus-prometheus 9090:9090 -n monitoring
```

Open:

```
http://localhost:9090
```

---

### Grafana

```
kubectl port-forward svc/monitoring-grafana 3001:80 -n monitoring
```

Open:

```
http://localhost:3001
```

Login:

```
admin / prom-operator
```

---

## Stress Testing

Example:

```
& "C:\Users\mindfire intern 1\Downloads\Apache24\bin\ab.exe" `
>>   -n 5000 -c 200 `
>>   -p post.json `
>>   -T application/json `
>>   http://localhost:5000/api/submit
done
```

---

## Observations

- Redis queue increases during load
- CPU usage increases in worker pods
- HPA scales worker pods automatically
- After scaling, queue backlog reduces
- Metrics are visible in Prometheus and Grafana
