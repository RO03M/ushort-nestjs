import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Global, Module } from "@nestjs/common";
import mikroOrmConfig from "../mikro-orm.config";

@Global()
@Module({
	imports: [
		MikroOrmModule.forRoot({
			autoLoadEntities: true,
			...mikroOrmConfig
		})
	]
})
export class DatabaseModule { }
