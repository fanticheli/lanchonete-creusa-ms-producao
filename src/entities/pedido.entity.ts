import { StatusPedidoEnum } from "../common/enum/status-pedido-enum";
import { PedidoProps, produtoProps } from "./props/pedido.props";

export class Pedido {
	private _id: string;
	private _cliente: string;
	private _produtos: produtoProps[];
	private _numeroPedido: number;
	private _statusPedido: StatusPedidoEnum;

	constructor(pedidoProps: PedidoProps) {
		this._id = pedidoProps.id;
		this._cliente = pedidoProps.cliente;
		this._produtos = pedidoProps.produtos;
		this._numeroPedido = pedidoProps.numeroPedido;
		this._statusPedido = StatusPedidoEnum.PREPARACAO;
	}

	get id(): string {
		return this._id;
	}

	get produtos(): produtoProps[] {
		return this._produtos;
	}

	get numeroPedido(): number {
		return this._numeroPedido;
	}

	get cliente(): string {
		return this._cliente;
	}

	get statusPedido(): StatusPedidoEnum {
		return this._statusPedido;
	}

	get object() {
		return {
			id: this._id,
			cliente: this._cliente,
			produtos: this._produtos,
			numeroPedido: this._numeroPedido,
			statusPedido: this._statusPedido,
		};
	}

	set id(id: string) {
		this._id = id;
	}

	set cliente(cliente: string) {
		this._cliente = cliente;
	}

	set produtos(produtos: produtoProps[]) {
		this._produtos = produtos;
	}

	set numeroPedido(numeroPedido: number) {
		this._numeroPedido = numeroPedido;
	}

	set statusPedido(statusPedido: StatusPedidoEnum) {
		this._statusPedido = statusPedido;
	}
}
