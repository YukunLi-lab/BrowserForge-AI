from app.core.config import get_settings

settings = get_settings()


class DeployerAgent:
    """
    Generates deployment configurations and deploys applications
    to Vercel, Netlify, or other platforms.
    """

    def __init__(self):
        pass

    async def run(self, generated_code: dict) -> dict:
        """
        Generate deployment configurations for the platform.
        Returns deployment configuration.
        """
        config = {
            "vercel": self._generate_vercel_config(),
            "netlify": self._generate_netlify_config(),
            "dockerfile": self._generate_dockerfile(),
        }

        return config

    def _generate_vercel_config(self) -> str:
        return '''{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install"
}'''

    def _generate_netlify_config(self) -> str:
        return '''[[build]]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
'''

    def _generate_dockerfile(self) -> str:
        return '''FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
'''
