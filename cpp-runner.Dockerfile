FROM gcc:13

RUN useradd -m runner
USER runner
WORKDIR /home/runner

CMD ["/bin/bash"]
