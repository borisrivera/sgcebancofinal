import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS para frontend (Vite)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  });

  // ✅ CONFIGURACIÓN SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Bank Fullstack API')
    .setDescription('API del sistema bancario (Clientes, Cuentas, Movimientos)')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);

  console.log('🚀 Backend corriendo en http://localhost:3001');
  console.log('📘 Swagger disponible en http://localhost:3001/api');
}

void bootstrap();
