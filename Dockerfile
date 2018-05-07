FROM amazonlinux

ADD etc/nodesource.gpg.key /etc

WORKDIR /tmp

RUN yum -y install gcc-c++ python && \
    rpm --import /etc/nodesource.gpg.key && \
    curl --location --output ns.rpm https://rpm.nodesource.com/pub_8.x/el/7/x86_64/nodejs-8.11.1-1nodesource.x86_64.rpm  && \
    rpm --checksig ns.rpm && \
    rpm --install --force ns.rpm && \
    npm cache clean --force && \
    yum clean all && \
    rm --force ns.rpm

WORKDIR /build
