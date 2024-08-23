# Use an official Go image as a base
FROM golang:1.20-alpine

# Set the working directory
WORKDIR /app

# Copy the Go modules files
COPY go.mod go.sum ./

# Download Go modules
RUN go mod download

# Copy the rest of the application code
COPY . .

# Build the application
RUN go build -o main .

# Expose port
EXPOSE 8080

# Command to run the executable
CMD ["./main"]
