FROM golang:1.21.0 AS builder

ENV GOOS=linux \
    GOARCH=amd64 \
    CGO_ENABLED=0

WORKDIR /build

# Let's cache modules retrieval - those don't change so often
COPY go.mod .
COPY go.sum .
RUN go mod download

# Copy the code necessary to build the application
# You may want to change this to copy only what you actually need.
COPY . .

# Build the application
RUN go build -o app

# Let's create a /dist folder containing just the files necessary for runtime.
# Later, it will be copied as the / (root) of the output image.
WORKDIR /dist
RUN cp /build/app ./app

# Create the minimal runtime image
FROM alpine

COPY --chown=0:0 --from=builder /dist /

# Set up the app to run as a non-root user
# User ID 65534 is usually user 'nobody'.
USER 65534

ENTRYPOINT ["/app"]