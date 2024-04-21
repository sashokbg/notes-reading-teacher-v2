npm run build

docker build -t sashokbg/notes_teacher:latest .

docker push sashokbg/notes_teacher:latest

kubectl rollout restart deployment/home-cloud-notes-teacher -n home-cloud
