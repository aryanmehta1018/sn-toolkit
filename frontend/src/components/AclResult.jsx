import { Badge, CopyButton, SectionTitle } from './ui.jsx';

const OP_VARIANT = {
  read: 'emerald', write: 'orange', create: 'blue', delete: 'red',
};

const PRIORITY_VARIANT = { High: 'red', Medium: 'orange', Low: 'yellow' };

function AclRow({ acl }) {
  return (
    <div className="px-5 py-3 hover:bg-[#1A1C26]/50 transition-colors">
      <div className="flex items-start gap-3 flex-wrap">
        <span className="font-mono text-xs text-cyan-400 shrink-0 pt-0.5 min-w-[160px]">{acl.name}</span>
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <Badge text={acl.type} variant="indigo" />
          <Badge text={acl.operation} variant={OP_VARIANT[acl.operation] || 'gray'} />
          <Badge text={acl.table} variant="blue" />
          {acl.field && acl.field !== '*' && <Badge text={`field: ${acl.field}`} variant="gray" />}
          {acl.roles?.map((r, i) => <Badge key={i} text={r} variant="purple" />)}
        </div>
      </div>
      <p className="text-xs text-[#8B8FA8] mt-1.5 ml-0">{acl.rationale}</p>
      {acl.condition && (
        <div className="mt-1.5 px-3 py-1.5 bg-[#0D0E14] rounded-lg border border-[#2A2D3E]">
          <span className="font-mono text-xs text-yellow-400/80">{acl.condition}</span>
        </div>
      )}
    </div>
  );
}

function RolesCard({ roles }) {
  return (
    <div className="card">
      <div className="card-header">
        <h4 className="text-[#F0F1F6] font-semibold text-sm">Custom Roles</h4>
      </div>
      <div className="divide-y divide-[#2A2D3E]/50">
        {roles.map((role, i) => (
          <div key={i} className="px-5 py-3 flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge text={role.name} variant="purple" />
                {role.suffix && <span className="font-mono text-xs text-[#4D5168]">{role.suffix}</span>}
              </div>
              <p className="text-xs text-[#8B8FA8] mt-1">{role.description}</p>
              {role.inherits_from?.length > 0 && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-xs text-[#4D5168]">Inherits:</span>
                  {role.inherits_from.map((r, j) => <Badge key={j} text={r} variant="gray" />)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendationsCard({ recs }) {
  return (
    <div className="card border-emerald-900/40">
      <div className="card-header bg-emerald-950/20 border-b border-emerald-900/30">
        <h4 className="text-emerald-400 font-semibold text-sm">Security Recommendations</h4>
      </div>
      <div className="divide-y divide-[#2A2D3E]/50">
        {recs.map((rec, i) => (
          <div key={i} className="px-5 py-3 flex items-start gap-3">
            <Badge text={rec.priority} variant={PRIORITY_VARIANT[rec.priority] || 'gray'} className="mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-[#F0F1F6]">{rec.recommendation}</p>
              {rec.rationale && <p className="text-xs text-[#8B8FA8] mt-0.5">{rec.rationale}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AclResult({ data }) {
  const json = JSON.stringify(data, null, 2);

  return (
    <div className="space-y-5">
      <SectionTitle meta={<CopyButton text={json} />}>Generated ACL Strategy</SectionTitle>

      {data.custom_roles?.length > 0 && <RolesCard roles={data.custom_roles} />}

      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h4 className="text-[#F0F1F6] font-semibold text-sm">
            Access Control Rules
            <span className="ml-2 text-[#4D5168] font-normal">({data.acls?.length})</span>
          </h4>
        </div>
        <div className="divide-y divide-[#2A2D3E]/50">
          {data.acls?.map((acl, i) => <AclRow key={i} acl={acl} />)}
        </div>
      </div>

      {data.data_policies?.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h4 className="text-[#F0F1F6] font-semibold text-sm">Data Policies</h4>
          </div>
          <div className="divide-y divide-[#2A2D3E]/50">
            {data.data_policies.map((dp, i) => (
              <div key={i} className="px-5 py-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-[#F0F1F6] font-medium">{dp.name}</span>
                  <Badge text={dp.table} variant="blue" />
                </div>
                <p className="text-xs text-[#8B8FA8] mt-1">{dp.conditions}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {dp.rules?.map((r, j) => (
                    <div key={j} className="flex gap-1">
                      <Badge text={r.field} variant="gray" />
                      {r.mandatory && <Badge text="mandatory" variant="red" />}
                      {r.read_only && <Badge text="read-only" variant="yellow" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.security_recommendations?.length > 0 && (
        <RecommendationsCard recs={data.security_recommendations} />
      )}
    </div>
  );
}
