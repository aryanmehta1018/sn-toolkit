import { Badge, CopyButton, SectionTitle } from './ui.jsx';

const STEP_TYPE_VARIANT = {
  'Action': 'emerald', 'If': 'orange', 'Else If': 'orange', 'Else': 'gray',
  'For Each': 'cyan', 'Wait for condition': 'yellow', 'Set Flow Variables': 'blue',
  'Create Record': 'indigo', 'Update Record': 'violet', 'Lookup Records': 'purple',
  'Delete Record': 'red', 'Ask for Approval': 'yellow', 'Send Email': 'cyan',
  'Rest Step': 'blue', 'Subflow': 'purple', 'Script': 'orange',
  'Do the following until': 'orange',
};

const TRIGGER_VARIANT = {
  'Record Created': 'emerald', 'Record Updated': 'orange',
  'Record Created or Updated': 'yellow', 'Schedule': 'cyan',
  'Manual': 'gray', 'Subflow': 'purple', 'REST API': 'blue',
};

function StepNode({ step, isLast }) {
  const variant = STEP_TYPE_VARIANT[step.type] || 'gray';
  const isConditional = ['If', 'Else If', 'Else'].includes(step.type);
  const indent = isConditional ? 'ml-8' : '';

  return (
    <div className={`flex gap-3 ${indent}`}>
      {/* Connector line */}
      <div className="flex flex-col items-center">
        <div className="w-7 h-7 rounded-full bg-[#1A1C26] border border-[#2A2D3E] flex items-center justify-center text-xs text-[#8B8FA8] font-mono shrink-0">
          {step.order}
        </div>
        {!isLast && <div className="w-px flex-1 bg-[#2A2D3E] mt-1 mb-1 min-h-[16px]" />}
      </div>

      <div className="flex-1 pb-4">
        <div className="flex items-start gap-2 flex-wrap">
          <span className="text-[#F0F1F6] text-sm font-medium leading-snug">{step.name}</span>
          <Badge text={step.type} variant={variant} />
        </div>
        <p className="text-xs text-[#8B8FA8] mt-1 leading-relaxed">{step.details}</p>

        {step.conditions && (
          <div className="mt-2 px-3 py-1.5 bg-orange-950/20 border border-orange-900/40 rounded-lg">
            <span className="text-xs text-orange-400 font-mono">{step.conditions}</span>
          </div>
        )}

        {step.outputs?.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className="text-xs text-[#4D5168]">outputs:</span>
            {step.outputs.map((o, i) => (
              <Badge key={i} text={o} variant="gray" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FlowCard({ flow }) {
  const json = JSON.stringify(flow, null, 2);

  return (
    <div className="card">
      <div className="card-header flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#F0F1F6] font-semibold">⚡ {flow.name}</span>
            <Badge text={flow.trigger?.type} variant={TRIGGER_VARIANT[flow.trigger?.type] || 'gray'} />
            {flow.trigger?.table && <Badge text={flow.trigger.table} variant="indigo" />}
          </div>
          <p className="text-[#8B8FA8] text-sm mt-0.5">{flow.description}</p>
          {flow.trigger?.condition && (
            <p className="text-xs text-[#4D5168] mt-1">Trigger condition: {flow.trigger.condition}</p>
          )}
        </div>
        <CopyButton text={json} />
      </div>

      <div className="px-5 pt-5 pb-2">
        {flow.steps?.map((step, i) => (
          <StepNode key={i} step={step} isLast={i === flow.steps.length - 1} />
        ))}
      </div>

      {flow.error_handling && (
        <div className="px-5 py-3 border-t border-[#2A2D3E] bg-[#0D0E14]/30 flex items-start gap-2">
          <span className="text-xs text-[#4D5168] shrink-0 mt-0.5">Error handling:</span>
          <span className="text-xs text-[#8B8FA8]">{flow.error_handling}</span>
        </div>
      )}

      {flow.outputs?.length > 0 && (
        <div className="px-5 py-3 border-t border-[#2A2D3E] flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#4D5168]">Flow outputs:</span>
          {flow.outputs.map((o, i) => (
            <Badge key={i} text={o.name} variant="blue" />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FlowsResult({ data }) {
  return (
    <div className="space-y-5">
      <SectionTitle meta={`${data.flows?.length} flow${data.flows?.length !== 1 ? 's' : ''}`}>
        Generated Flows
      </SectionTitle>
      {data.flows?.map((flow, i) => (
        <FlowCard key={i} flow={flow} />
      ))}
    </div>
  );
}
