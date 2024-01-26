export class LanchoneteCreusa {
	constructor() {}

	start() {
		const express = require("express");

		const lanchoneteCreusa = express();
		const swaggerUi = require("swagger-ui-express");
		const swaggerSpec = require("./swagger");
		lanchoneteCreusa.use(express.json());
		const PORT = process.env.PORT || 3000;

		const docsRoutes = require("./routes/docs");
		const indexRoutes = require("./routes/routes");
		const pedidosRoutes = require("./routes/pedido");

		lanchoneteCreusa.use("/api", indexRoutes);
		lanchoneteCreusa.use("/api-json", docsRoutes);
		lanchoneteCreusa.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
		lanchoneteCreusa.use("/api/producao-pedidos", pedidosRoutes);

		lanchoneteCreusa.listen(PORT, () => {
			console.log(`Lanchonete da Creusa app listening on port ${PORT}`);
		});
	}
}
