FROM amazonlinux

ARG aws_access_key_id
ARG aws_secret_access_key

ADD etc/nodesource.gpg.key /etc

WORKDIR /tmp

RUN yum -y install gcc-c++ ruby && \
    rpm --import /etc/nodesource.gpg.key && \
    curl --location --output ns.rpm https://rpm.nodesource.com/pub_6.x/el/7/x86_64/nodejs-6.10.1-1nodesource.el7.centos.x86_64.rpm && \
    rpm --checksig ns.rpm && \
    rpm --install --force ns.rpm && \
    npm install -g npm@latest && \
    npm cache clean --force && \
    yum clean all && \
    rm --force ns.rpm

WORKDIR /build

ENV AWS_ACCESS_KEY_ID=$aws_access_key_id

ENV AWS_SECRET_ACCESS_KEY=$aws_secret_access_key