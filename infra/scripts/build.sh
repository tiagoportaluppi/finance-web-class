echo '===> Building docker image...'

GIT_BRANCH=$(git name-rev --name-only HEAD | sed "s/~.*//")
GIT_COMMIT=$(git rev-parse HEAD)
GIT_COMMIT_SHORT=$(echo $GIT_COMMIT | head -c 8)
BUILD_CREATOR=$(git config user.email)

docker build \
  -t "$PROJECT"_"$STAGE" \
  --build-arg GIT_BRANCH="$GIT_BRANCH" \
  --build-arg GIT_COMMIT="$GIT_COMMIT" \
  --build-arg BUILD_CREATOR="$BUILD_CREATOR" \
  .

echo '\n Done'
# echo "Push to quay using:"
# echo "  docker push quay.io/myco/servicename:latest"
# echo "  docker push quay.io/myco/servicename:$GIT_COMMIT_SHORT"
