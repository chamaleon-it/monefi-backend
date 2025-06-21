import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from 'src/config/configuration';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        return {
          uri: configuration().database_url,
          connectionFactory: (connection) => {
            // Helper function to get readable connection state
            const getConnectionState = (state: number): string => {
              const states = {
                0: '🔴 Disconnected',
                1: '✅ Connected',
                2: '🔗 Connecting',
                3: '⚠️ Disconnecting',
              };
              return states[state] || `Unknown state: ${state}`;
            };

            // Set up listeners immediately
            setImmediate(() => {
              connection.on('connecting', () => {
                console.log('🔗 Connecting to MongoDB...');
              });

              connection.on('connected', () => {
                console.log('✅ MongoDB connected successfully');
              });

              connection.on('disconnected', () => {
                console.warn(
                  '⚠️ MongoDB disconnected. Attempting to reconnect...',
                );
              });

              connection.on('error', (err) => {
                console.error('❌ MongoDB connection error:', err.message);
              });

              connection.on('reconnected', () => {
                console.log('🔄 MongoDB reconnected successfully');
              });

              // Additional useful events
              connection.on('reconnectFailed', () => {
                console.error('💥 MongoDB reconnection failed');
              });

              connection.on('close', () => {
                console.log('🔒 MongoDB connection closed');
              });

              // Log current connection state
              console.log(
                `📊 Current MongoDB connection state: ${getConnectionState(connection.readyState)}`,
              );

              // Log database name if connected
              if (connection.readyState === 1 && connection.db) {
                console.log(
                  `🗄️ Connected to database: ${connection.db.databaseName}`,
                );
              }
            });

            return connection;
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
