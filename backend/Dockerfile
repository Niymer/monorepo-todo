FROM node:18
WORKDIR /app
RUN npm install -g pnpm

# Copy workspace files for installing deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/package.json

# Install only backend dependencies
RUN pnpm --filter todo-backend install --prod

# Copy backend source
COPY backend ./backend
WORKDIR /app/backend

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000
CMD ["node", "index.js"]
