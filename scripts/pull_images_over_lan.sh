#!/bin/bash

local_repo="r.alexellis.io:5043/"
images=("mhart/alpine-node:4" "alexellis2/learnyounodedocker:latest" "mono:3.12.0-onbuild" "redis:latest")

pull_and_tag()
{
  for image in ${images[*]};
  do
    echo "Pulling $local_repo$image"
    docker pull $local_repo$image
    docker tag $local_repo$image $image
  done
}

pull_and_tag

