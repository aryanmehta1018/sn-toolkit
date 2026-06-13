import { Badge, CopyButton, SectionTitle } from './ui.jsx';

const VAR_TYPE_VARIANT = {
  'Single Line Text': 'blue', 'Multi Line Text': 'blue',
  'Select Box': 'orange', 'Multiple Choice': 'orange',
  'Check Box': 'yellow', 'Date': 'gray', 'Date/Time': 'gray',
  'Reference': 'emerald', 'Attachment': 'purple',
  'Email': 'cyan', 'IP Address': 'violet',
  'Numeric Scale': 'indigo', 'Label': 'gray',
  'Masked': 'red',
};

function VariableRow({ variable }) {
  return (
    <div className="px-5 py-3 flex items-start gap-3 hover:bg-[#1A1C26]/50 transition-colors group">
      <span className="w-6 text-xs text-[#4D5168] font-mono pt-0.5 shrink-0">{variable.order || '—'}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm text-[#F0F1F6] font-medium">{variable.label}</span>
          <Badge text={variable.type} variant={VAR_TYPE_VARIANT[variable.type] || 'gray'} />
          {variable.mandatory && <Badge text="required" variant="red" />}
        </div>
        <span className="font-mono text-xs text-cyan-400/70">{variable.name}</span>
        {variable.help_text && (
          <p className="text-xs text-[#4D5168] mt-0.5">{variable.help_text}</p>
        )}
        {variable.choices?.length > 0 && (
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {variable.choices.map((c, i) => <Badge key={i} text={c} variant="gray" />)}
          </div>
        )}
        {variable.reference_table && (
          <Badge text={`→ ${variable.reference_table}`} variant="emerald" className="mt-1.5" />
        )}
      </div>
    </div>
  );
}

function CatalogCard({ item }) {
  const json = JSON.stringify(item, null, 2);

  return (
    <div className="card">
      <div className="card-header flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-[#F0F1F6] font-semibold">📋 {item.name}</h4>
            <Badge text={item.category} variant="violet" />
            <Badge text={`${item.sla_days}d SLA`} variant="orange" />
            {item.approval_required && <Badge text="approval required" variant="yellow" />}
          </div>
          <p className="text-[#F0F1F6]/70 text-sm mt-0.5">{item.short_description}</p>
        </div>
        <CopyButton text={json} />
      </div>

      <div className="px-5 py-3 border-b border-[#2A2D3E] text-xs text-[#8B8FA8] space-y-1">
        <p>{item.description}</p>
        <div className="flex gap-4 flex-wrap mt-2">
          <span>Fulfillment: <span className="text-[#F0F1F6]">{item.fulfillment_group}</span></span>
          {item.flow_or_workflow && <span>Flow: <span className="text-[#6366F1]">{item.flow_or_workflow}</span></span>}
          {item.approval_group && <span>Approver: <span className="text-[#F0F1F6]">{item.approval_group}</span></span>}
          <span>Price: <span className="text-[#F0F1F6]">${item.price ?? 0}</span></span>
        </div>
      </div>

      {/* Variable headers */}
      <div className="flex items-center gap-3 px-5 py-2 bg-[#0D0E14]/50 border-b border-[#2A2D3E]">
        <span className="w-6 text-xs text-[#4D5168] font-mono shrink-0">#</span>
        <span className="flex-1 text-xs text-[#4D5168] uppercase tracking-wider">Variables</span>
      </div>

      <div className="divide-y divide-[#2A2D3E]/50">
        {item.variables?.map((v, i) => <VariableRow key={i} variable={v} />)}
      </div>

      {item.ui_policy_hints?.length > 0 && (
        <div className="px-5 py-3 border-t border-[#2A2D3E] bg-[#0D0E14]/30 space-y-1">
          <span className="text-xs text-[#4D5168] font-medium">UI Policies</span>
          {item.ui_policy_hints.map((hint, i) => (
            <p key={i} className="text-xs text-[#8B8FA8] flex gap-1.5">
              <span className="text-[#6366F1] shrink-0">›</span> {hint}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CatalogResult({ data }) {
  return (
    <div className="space-y-5">
      <SectionTitle meta={`${data.catalog_items?.length} item${data.catalog_items?.length !== 1 ? 's' : ''}`}>
        Generated Catalog Items
      </SectionTitle>
      {data.catalog_items?.map((item, i) => (
        <CatalogCard key={i} item={item} />
      ))}
    </div>
  );
}
