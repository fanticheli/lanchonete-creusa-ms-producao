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
});
