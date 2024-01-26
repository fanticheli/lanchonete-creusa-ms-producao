const mongoose = require("mongoose");

const PedidoSchema = new mongoose.Schema(
	{
		produtos: [],
		cliente: String,
		valorTotal: Number,
		numeroPedido: Number,
		statusPedido: String,
	},
	{
		timestamps: true,
	}
);

export const PedidoMongo = mongoose.model("Pedido", PedidoSchema);
