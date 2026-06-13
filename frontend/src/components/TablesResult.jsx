import { Badge, CopyButton, SectionTitle, Divider } from './ui.jsx';

const FIELD_TYPE_VARIANT = {
  string: 'blue', integer: 'purple', boolean: 'orange',
  reference: 'emerald', choice: 'orange', date: 'gray',
  datetime: 'gray', currency: 'emerald', url: 'cyan',
  email: 'cyan', html: 'violet', script: 'red',
  percent_complete: 'orange', decimal: 'purple', glide_list: 'indigo',
};

function FieldRow({ field }) {
  return (
    <div className="flex items-start gap-3 px-5 py-2.5 hover:bg-[#1A1C26]/50 transition-colors group">
      <div className="w-44 shrink-0 pt-0.5">
        <span className="font-mono text-xs text-cyan-400">{field.name}</span>
      </div>
      <div className="w-36 shrink-0 pt-0.5">
        <span className="text-sm text-[#F0F1F6]">{field.label}</span>
      </div>
      <div className="flex items-center gap-2 flex-1 flex-wrap">
        <Badge text={field.type} variant={FIELD_TYPE_VARIANT[field.type] || 'gray'} />
        {field.mandatory && <Badge text="required" variant="red" />}
        {field.reference_table && (
          <Badge text={`→ ${field.reference_table}`} variant="emerald" />
        )}
        {field.choice_values?.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {field.choice_values.slice(0, 3).map((c, i) => (
              <Badge key={i} text={c} variant="gray" />
            ))}
            {field.choice_values.length > 3 && (
              <Badge text={`+${field.choice_values.length - 3}`} variant="gray" />
            )}
          </div>
        )}
      </div>
      <p className="text-xs text-[#4D5168] group-hover:text-[#8B8FA8] transition-colors max-w-xs text-right leading-relaxed hidden xl:block">
        {field.description}
      </p>
    </div>
  );
}

function TableCard({ table }) {
  const json = JSON.stringify(table, null, 2);

  return (
    <div className="card">
      <div className="card-header flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-[#F0F1F6] font-semibold">{table.label}</h4>
            <Badge text={table.name} variant="indigo" />
            {table.extends && (
              <Badge text={`extends ${table.extends}`} variant="violet" />
            )}
          </div>
          <p className="text-[#8B8FA8] text-sm mt-0.5">{table.description}</p>
        </div>
        <CopyButton text={json} />
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-3 px-5 py-2 bg-[#0D0E14]/50 border-b border-[#2A2D3E]">
        <span className="w-44 text-xs text-[#4D5168] font-mono uppercase tracking-wider shrink-0">Field Name</span>
        <span className="w-36 text-xs text-[#4D5168] uppercase tracking-wider shrink-0">Label</span>
        <span className="flex-1 text-xs text-[#4D5168] uppercase tracking-wider">Type / Attributes</span>
      </div>

      <div className="divide-y divide-[#2A2D3E]/50">
        {table.fields?.map((f, i) => <FieldRow key={i} field={f} />)}
      </div>

      {table.indexes?.length > 0 && (
        <div className="px-5 py-3 border-t border-[#2A2D3E] bg-[#0D0E14]/30 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#4D5168]">Indexed:</span>
          {table.indexes.map((idx, i) => (
            <Badge key={i} text={idx} variant="gray" />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TablesResult({ data }) {
  return (
    <div className="space-y-5">
      <SectionTitle meta={`${data.tables?.length} table${data.tables?.length !== 1 ? 's' : ''}`}>
        Generated Tables
      </SectionTitle>
      {data.tables?.map((table, i) => (
        <TableCard key={i} table={table} />
      ))}
    </div>
  );
}
