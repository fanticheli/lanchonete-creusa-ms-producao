import { CategoriaEnum } from "../../src/common/enum/categoria-enum";
import { StatusPagamentoEnum } from "../../src/common/enum/status-pagamento-enum";
import { StatusPedidoEnum } from "../../src/common/enum/status-pedido-enum";
import { Pedido } from "../../src/entities/pedido.entity";
import { PedidoProps } from "../../src/entities/props/pedido.props";

describe("Pedido", () => {
	it("should be defined", () => {
		expect(true).toBeDefined();
	});

	it("Create a new Pedido", () => {
		const pedidoProps: PedidoProps = {
      		id: "01",
			produtos: [{descricao: "1", categoria: CategoriaEnum.BEBIDA}],
			cliente: "Cliente 1",
			numeroPedido: 1,
			statusPedido: StatusPedidoEnum.RECEBIDO,
		};

		const pedido = new Pedido(pedidoProps);
		expect(pedido).toBeInstanceOf(Pedido);
		expect(pedido.id).toBe("01");
		expect(pedido.produtos.length).toBe(1);
		expect(pedido.cliente).toBe("Cliente 1");
	});

	it('should set new values for pedido properties', () => {
        const pedidoProps = {
            id: '04',
            produtos: [{ descricao: 'Produto 4', categoria: CategoriaEnum.LANCHE }],
            cliente: 'Cliente 4',
            numeroPedido: 4,
            statusPedido: StatusPedidoEnum.CANCELADO,
        };

        const pedido = new Pedido(pedidoProps);

        pedido.id = '04_NEW';
        pedido.cliente = 'Cliente 4_NEW';
        pedido.produtos = [{ descricao: 'Produto 4_NEW', categoria: CategoriaEnum.LANCHE}];
        pedido.numeroPedido = 44;
        pedido.statusPedido = StatusPedidoEnum.CANCELADO;

        expect(pedido.id).toBe('04_NEW');
        expect(pedido.cliente).toBe('Cliente 4_NEW');
        expect(pedido.produtos.length).toBe(1);
        expect(pedido.produtos[0].descricao).toBe('Produto 4_NEW');
        expect(pedido.numeroPedido).toBe(44);
        expect(pedido.statusPedido).toBe(StatusPedidoEnum.CANCELADO);
    });

    it('should set new values for pedido properties', () => {
        const pedidoProps = {
            id: '04',
            produtos: [{ descricao: 'Produto 4', categoria: CategoriaEnum.LANCHE }],
            cliente: 'Cliente 4',
            numeroPedido: 4,
            statusPedido: StatusPedidoEnum.PRONTO,
        };

        const pedido = new Pedido(pedidoProps);

        pedido.id = '04_NEW';
        pedido.cliente = 'Cliente 4_NEW';
        pedido.produtos = [{ descricao: 'Produto 4_NEW', categoria: CategoriaEnum.LANCHE }];
        pedido.numeroPedido = 44;
        pedido.statusPedido = StatusPedidoEnum.CANCELADO;

        expect(pedido.id).toBe('04_NEW');
        expect(pedido.cliente).toBe('Cliente 4_NEW');
        expect(pedido.produtos.length).toBe(1);
        expect(pedido.produtos[0].descricao).toBe('Produto 4_NEW');
        expect(pedido.numeroPedido).toBe(44);
        expect(pedido.statusPedido).toBe(StatusPedidoEnum.CANCELADO);
    });

});
