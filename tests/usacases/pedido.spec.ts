import { CategoriaEnum } from "../../src/common/enum/categoria-enum";
import { StatusPagamentoEnum } from "../../src/common/enum/status-pagamento-enum";
import { StatusPedidoEnum } from "../../src/common/enum/status-pedido-enum";
import { PedidoProps } from "../../src/entities/props/pedido.props";
import { PedidoRepositoryInMemory } from "../../src/external/memory/pedido.repository";
import { PedidoUseCases } from "../../src/usecases/pedido";

describe("Pedido", () => {
	const pedidoRepository = new PedidoRepositoryInMemory();

	test("Deve criar um pedido", async () => {
		const pedidoProps: PedidoProps = {
			id: "01",
			produtos: [{descricao: "1", categoria: CategoriaEnum.BEBIDA}],
			cliente: "Cliente 1",
			numeroPedido: 1,
			statusPedido: StatusPedidoEnum.RECEBIDO,
		};

		const novoPedido = await PedidoUseCases.CriarPedido(
			pedidoRepository,
			pedidoProps
		);

		expect(novoPedido).toBeDefined();
		expect(novoPedido.id).toBe("01");
		expect(novoPedido.produtos).toHaveLength(1);
		expect(novoPedido.numeroPedido).toBe(1);
		expect(novoPedido.cliente).toBe("Cliente 1");
		expect(novoPedido.statusPedido).toBe(StatusPedidoEnum.RECEBIDO);
	});

	test("Deve buscar um pedido por ID", async () => {
		const pedidoEncontrado = await PedidoUseCases.BuscarPedidoPorID(
			pedidoRepository,
			"01"
		);

		expect(pedidoEncontrado).toBeDefined();
		expect(pedidoEncontrado?.id).toBe("01");
		expect(pedidoEncontrado?.produtos).toHaveLength(1);
		expect(pedidoEncontrado?.numeroPedido).toBe(1);
		expect(pedidoEncontrado?.cliente).toBe("Cliente 1");
		expect(pedidoEncontrado?.statusPedido).toBe(StatusPedidoEnum.RECEBIDO);
	});

	test("Deve alterar o status de um pedido", async () => {
		const pedidoEmPreparo = await PedidoUseCases.AlterarStatusPedido(
			pedidoRepository,
			"01",
			StatusPedidoEnum.PREPARACAO
		);

		expect(pedidoEmPreparo).toBeDefined();
		expect(pedidoEmPreparo?.id).toBe("01");
		expect(pedidoEmPreparo?.produtos).toHaveLength(1);
		expect(pedidoEmPreparo?.numeroPedido).toBe(1);
		expect(pedidoEmPreparo?.cliente).toBe("Cliente 1");
		expect(pedidoEmPreparo?.statusPedido).toBe(StatusPedidoEnum.PREPARACAO);
	})

	test("Deve listar todos os pedidos", async () => {
		const pedidos = await PedidoUseCases.ListaPedidos(pedidoRepository);
		expect(pedidos).toHaveLength(1);
	});

});
