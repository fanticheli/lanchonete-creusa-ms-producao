import amqp from 'amqplib';
import { IPedidoGateway } from '../../interfaces';
import { PedidoProps } from '../../entities/props/pedido.props';
import { PedidoUseCases } from '../../usecases/pedido';
import { PedidoOutput } from '../../adapters/pedido';
import { PedidoRepositoryInMongo } from '../mongo/repositories/pedido.repository';

export class RabbitMQManager {
    private pedidoRepositoryInMongo = new PedidoRepositoryInMongo();

    constructor() { }

    async consumerQueuePedidos() {
        try {
            const queueName = process.env.QUEUE_PRODUCAO_NAME || '';
            const connection = await amqp.connect(process.env.QUEUE_HOST || '');
            const channel = await connection.createChannel();
            await channel.assertQueue(queueName, { durable: true });
            channel.consume(queueName, (msg) => {
                if (msg !== null) {
                    RabbitMQManager.CriarPedido(
                        this.pedidoRepositoryInMongo,
                        JSON.parse(msg.content.toString())
                    )
                        .then(() => {
                            channel.ack(msg);
                        })
                        .catch((error) => {
                            console.error('Erro ao criar pagamento:', error);
                        });
                }
            });

        } catch (error) {
            console.error('Erro ao criar consumidor:', error);
        }
    }

    static async CriarPedido(
        pedidoGatewayInterface: IPedidoGateway,
        pedidoProps: PedidoProps
    ): Promise<PedidoOutput> {
        try {
            return await PedidoUseCases.CriarPedido(
                pedidoGatewayInterface,
                pedidoProps
            );
        } catch (error) {
            throw error;
        }
    }
}