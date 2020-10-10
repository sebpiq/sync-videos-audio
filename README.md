```
docker build -t sync-audio-video .

docker volume create media-volume

docker run -p 8080:3000 --mount type=volume,source=media-volume,destination=/code/www/media --rm --name sync-server -t sync-audio-video

docker cp <PATH_TO_FILES>/. sync-server:/code/www/media
```

TODO
=====

- save server state
- server restart
- client auto reconnect
- web audio polyfills + normalize prefixes
- mp3 VS ogg supported / mp4 VS webm
- start / stop / pause video, how does it affect the sync state
- drop-in video of your choice
- dockerize
- check time drift video and audio
- parametrize config : `export $(grep -v '^#' .env | xargs)` REF : https://stackoverflow.com/questions/19331497/set-environment-variables-from-file-of-key-value-pairs