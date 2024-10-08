NAME := 127.0.0.1:5000/manage-web
TAG := $$(git log -1 --pretty=%h)
IMG := ${NAME}:${TAG}
LATEST := ${NAME}:latest

buildimage:
	@docker build -t ${IMG} .
	@docker tag ${IMG} ${LATEST}

pushimage: buildimage
	@docker push ${LATEST}

runapp: buildimage
	@docker run ${NAME}