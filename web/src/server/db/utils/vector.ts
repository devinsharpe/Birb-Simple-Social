import type { ColumnBuilderConfig, ColumnConfig } from "drizzle-orm";
import type {
  AnyPgTable,
  PgColumnBuilderHKT,
  PgColumnHKT,
} from "drizzle-orm/pg-core";
import { PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core";

type PgTSVectorBuilderConfig = {
  sources: string[] | undefined;
  weighted?: boolean;
};

export interface PgTSVectorConfig {
  sources?: PgTSVectorBuilderConfig["sources"];
  weighted?: PgTSVectorBuilderConfig["weighted"];
}

function generateTsvectorColumn(input: string[]) {
  const columnExpressions = input.map((column, index) => {
    const weight = String.fromCharCode(index + 65);
    return `setweight(to_tsvector('english', coalesce(${column}, '')), '${weight}')`;
  });

  const tsvectorColumn = `tsvector GENERATED ALWAYS AS (${columnExpressions.join(
    " || "
  )}) STORED`;

  return tsvectorColumn;
}

export class PgTSVectorBuilder<
  TData extends string = string
> extends PgColumnBuilder<
  PgColumnBuilderHKT,
  ColumnBuilderConfig<{ data: TData; driverParam: string }>,
  PgTSVectorBuilderConfig
> {
  protected $pgColumnBuilderBrand = "PgTSVectorBuilder";

  constructor(name: string, config: PgTSVectorConfig) {
    super(name);
    this.config.sources = config.sources;
    this.config.weighted = config.weighted;
  }

  build<TTableName extends string>(
    table: AnyPgTable<{ name: TTableName }>
  ): PgTSVector<TTableName, TData> {
    const xyz = new PgTSVector(table, this.config);
    return xyz;
  }
}

export class PgTSVector<
  TTableName extends string,
  TData extends string
> extends PgColumn<
  PgColumnHKT,
  ColumnConfig<{ tableName: TTableName; data: TData; driverParam: string }>,
  { sources: string[] | undefined; weighted?: boolean }
> {
  constructor(
    table: AnyPgTable<{ name: TTableName }>,
    builder: PgTSVectorBuilder<TData>["config"]
  ) {
    super(table, builder);
  }

  getSQLType(): string {
    return this.config.sources === undefined
      ? `tsvector`
      : this.config.weighted
      ? generateTsvectorColumn(this.config.sources)
      : `tsvector generated always as (to_tsvector('english', ${this.config.sources.join(
          " || ' ' || "
        )})) stored`;
  }
}

export function tsvector<TName extends string>(
  name: string,
  config: PgTSVectorConfig = {}
): PgTSVectorBuilder<TName> {
  return new PgTSVectorBuilder(name, config);
}
