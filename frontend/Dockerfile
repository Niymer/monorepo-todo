FROM node:18 AS build
WORKDIR /app
RUN npm install -g pnpm

# Install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/package.json
RUN pnpm --filter todo-frontend install

# Copy source
COPY frontend ./frontend
WORKDIR /app/frontend

# Build with configurable API base URL
ARG VITE_API_BASE_URL=http://backend:3000/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN pnpm run build

# Use vite preview to serve
EXPOSE 4173
CMD ["pnpm", "run", "preview", "--", "--host", "0.0.0.0"]
