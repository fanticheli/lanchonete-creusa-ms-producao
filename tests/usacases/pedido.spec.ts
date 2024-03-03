import amqp from 'amqplib';
import { CategoriaEnum } from "../../src/common/enum/categoria-enum";
import { StatusPagamentoEnum } from "../../src/common/enum/status-pagamento-enum";
import { StatusPedidoEnum } from "../../src/common/enum/status-pedido-enum";
import { PedidoProps } from "../../src/entities/props/pedido.props";
import { PedidoRepositoryInMemory } from "../../src/external/memory/pedido.repository";
import { PedidoUseCases } from "../../src/usecases/pedido";
import { IPedidoGateway } from "../../src/interfaces";

jest.mock('amqplib');
class MockChannel {
	assertQueue() {
		return Promise.resolve();
	}

	sendToQueue() {
		return Promise.resolve();
	}
}

class MockConnection {
	createConfirmChannel() {
		return Promise.resolve(new MockChannel());
	}

	createChannel() {
		return Promise.resolve(new MockChannel());
	}

	close() {
		return Promise.resolve();
	}
}

describe('Pedido', () => {
    const pedidoRepository = new PedidoRepositoryInMemory();
    let pedidoGatewayMock: IPedidoGateway;
    beforeEach(() => {
        pedidoGatewayMock = {
            CriarPedido: jest.fn(),
            BuscarPedidoPorID: jest.fn(),
            EditarPedido: jest.fn(),
            ListarPedidos: jest.fn(),
        };
    });

    test('CriarPedido - Deve criar um pedido', async () => {
        const pedidoProps: PedidoProps = {
            id: '01',
            produtos: [{ descricao: '1', categoria: CategoriaEnum.BEBIDA }],
            cliente: 'Cliente 1',
            numeroPedido: 1,
            statusPedido: StatusPedidoEnum.PREPARACAO,
        };

        const novoPedido = await PedidoUseCases.CriarPedido(pedidoRepository, pedidoProps);

        expect(novoPedido).toBeDefined();
        expect(novoPedido.id).toBe('01');
        expect(novoPedido.produtos).toHaveLength(1);
        expect(novoPedido.numeroPedido).toBe(1);
        expect(novoPedido.cliente).toBe('Cliente 1');
        expect(novoPedido.statusPedido).toBe(StatusPedidoEnum.PREPARACAO);
    });

    test('BuscarPedidoPorID - Deve buscar um pedido por ID', async () => {
        const pedidoEncontrado = await PedidoUseCases.BuscarPedidoPorID(pedidoRepository, '01');

        expect(pedidoEncontrado).toBeDefined();
        expect(pedidoEncontrado?.id).toBe('01');
        expect(pedidoEncontrado?.produtos).toHaveLength(1);
        expect(pedidoEncontrado?.numeroPedido).toBe(1);
        expect(pedidoEncontrado?.cliente).toBe('Cliente 1');
        expect(pedidoEncontrado?.statusPedido).toBe(StatusPedidoEnum.PREPARACAO);
    });

    test('BuscarPedidoPorID - Should find an existing pedido by ID', async () => {
        const pedidoProps = {
            id: '1',
            produtos: [{ descricao: 'Produto 1', categoria: CategoriaEnum.BEBIDA }],
            cliente: 'Cliente 1',
            numeroPedido: 1,
            statusPedido: StatusPedidoEnum.PREPARACAO,
        };

        const createdPedido = await pedidoRepository.CriarPedido(pedidoProps);

        const foundPedido = await pedidoRepository.BuscarPedidoPorID(createdPedido.id);

        expect(foundPedido).toBeDefined();
        expect(foundPedido?.id).toBe(createdPedido.id);
        expect(foundPedido?.statusPedido).toBe(StatusPedidoEnum.PREPARACAO);
    });

    test('BuscarPedidoPorID - Should return null for non-existent pedido ID', async () => {
        const nonExistentPedidoID = 'nonExistentID';

        const foundPedido = await pedidoRepository.BuscarPedidoPorID(nonExistentPedidoID);

        expect(foundPedido).toBeNull();
    });

    test('BuscarPedidoPorID - Should find a pedido by ID', async () => {
        const pedidoID = '01';

        (pedidoGatewayMock.BuscarPedidoPorID as jest.Mock).mockResolvedValue('foundPedido');
        const result = await PedidoUseCases.BuscarPedidoPorID(pedidoGatewayMock, pedidoID);

        expect(result).toBe('foundPedido');
        expect(pedidoGatewayMock.BuscarPedidoPorID).toHaveBeenCalledWith(pedidoID);
    });

    test('BuscarPedidoPorID - Should throw an error when pedido is not found', async () => {
        const pedidoID = 'nonExistentID';

        (pedidoGatewayMock.BuscarPedidoPorID as jest.Mock).mockResolvedValue(null);

        await expect(
            PedidoUseCases.BuscarPedidoPorID(pedidoGatewayMock, pedidoID)
        ).rejects.toThrow('Pedido não encontrado');

        expect(pedidoGatewayMock.BuscarPedidoPorID).toHaveBeenCalledWith(pedidoID);
    });

    test('AlterarStatusPedido - Deve alterar o status de um pedido', async () => {
        const mockResponse = {
            data: {},
        };


        (amqp.connect as jest.Mock).mockImplementation(() => Promise.resolve(new MockConnection()));
        const pedidoEmPreparo = await PedidoUseCases.AlterarStatusPedido(
            pedidoRepository,
            '01',
            StatusPedidoEnum.PREPARACAO
        );

        expect(pedidoEmPreparo).toBeDefined();
        expect(pedidoEmPreparo?.id).toBe('01');
        expect(pedidoEmPreparo?.produtos).toHaveLength(1);
        expect(pedidoEmPreparo?.numeroPedido).toBe(1);
        expect(pedidoEmPreparo?.cliente).toBe('Cliente 1');
        expect(pedidoEmPreparo?.statusPedido).toBe(StatusPedidoEnum.PREPARACAO);
    });
    test('AlterarStatusPedido - Should throw an error for an invalid status', async () => {
        const pedidoID = '02';
        const invalidStatus = 'INVALID_STATUS' as StatusPedidoEnum; // Convert to StatusPedidoEnum

        const mockPedido = {
            id: pedidoID,
            produtos: [],
            cliente: 'Cliente 1',
            numeroPedido: 1,
            statusPedido: StatusPedidoEnum.PREPARACAO,
        };

        (pedidoGatewayMock.BuscarPedidoPorID as jest.Mock).mockResolvedValue(mockPedido);

        await expect(
            PedidoUseCases.AlterarStatusPedido(pedidoGatewayMock, pedidoID, invalidStatus)
        ).rejects.toThrow('Status de pedido inválido');

        expect(pedidoGatewayMock.EditarPedido).not.toHaveBeenCalled();
    });

    test('AlterarStatusPedido - Should throw an error when pedido is not found', async () => {
        const pedidoID = 'nonExistentID';
        const validStatus = StatusPedidoEnum.PREPARACAO;

        // Mock the gateway method to return null, simulating a pedido not found scenario

        (pedidoGatewayMock.BuscarPedidoPorID as jest.Mock).mockResolvedValue(null);

        await expect(
            PedidoUseCases.AlterarStatusPedido(pedidoGatewayMock, pedidoID, validStatus)
        ).rejects.toThrow('Pedido não encontrado');

        expect(pedidoGatewayMock.BuscarPedidoPorID).toHaveBeenCalledWith(pedidoID);
        expect(pedidoGatewayMock.EditarPedido).not.toHaveBeenCalled(); // Ensure EditarPedido is not called when pedido is not found
    });


    test('ListaPedidos - Deve listar todos os pedidos', async () => {
        const pedidos = await PedidoUseCases.ListaPedidos(pedidoRepository);
        expect(pedidos).toHaveLength(2);
    });

});