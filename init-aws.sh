
# Create an S3 bucket
awslocal s3api create-bucket --bucket vercel-clone
echo "S3 bucket vercel-clone created."

awslocal ecs register-task-definition \
  --family my-task-def \
  --container-definitions '[{
    "name": "builder-image",
    "image": "nginx:latest", # Docker Hub image
    "memory": 512,
    "cpu": 256,
    "essential": true,
    "portMappings": [{
      "containerPort": 80,
      "hostPort": 80
    }]
  }]'