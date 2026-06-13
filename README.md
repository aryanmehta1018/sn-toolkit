# SN Toolkit

**ServiceNow Developer Productivity, powered by AI.**

SN Toolkit turns plain English business requirements into production-ready ServiceNow artifacts in seconds. No more staring at a blank ServiceNow Studio. Describe what you need to build, and get complete, structured output you can take straight into your instance.

---

## What it does

Most ServiceNow development starts the same way — someone hands you a Word document full of requirements and you spend hours translating that into tables, flows, catalog items, and access rules. SN Toolkit automates that translation layer.

You describe your use case once. The toolkit generates all four artifact types from the same requirements.

---

## The four generators

### Tables
Generates a complete table schema — field names, data types, mandatory flags, reference relationships, choice values, indexes, and role definitions. Output follows ServiceNow naming conventions (`u_` prefix, snake_case) and includes everything you need to create the table in Studio or via update set.

### Flows
Builds out Flow Designer logic — trigger type, table, conditions, and a full step-by-step flow with action types, inputs, outputs, and error handling. Covers approvals, email notifications, record operations, subflows, and conditional branching.

### Catalog Items
Produces a complete service catalog item definition — category, SLA, fulfillment group, approval settings, and every variable with its type, order, help text, choice options, and UI policy hints for show/hide rules.

### ACLs
Designs a full access control strategy — custom role definitions with inheritance, record and field-level ACL rules for every operation (read, write, create, delete), data policies, and prioritised security recommendations.

---

## How to use it

**1. Write your requirements**

Use the text area on the left. Write in plain English — no special format needed. The more specific you are about users, data, and processes, the better the output.

A good requirement covers:
- What data needs to be stored and tracked
- Who the different types of users are and what they can do
- What processes or approvals need to happen automatically
- Any business rules or constraints

**2. Load an example (optional)**

Each artifact type has a built-in example you can load with one click. Use these to see what good input looks like, or as a starting point to edit.

**3. Pick an artifact type**

Select Tables, Flows, Catalog, or ACLs from the card grid. You can generate all four from the same requirements — just switch tabs and hit Generate each time.

**4. Generate**

Hit the Generate button. Output appears on the right in a structured, readable format with all fields broken out, colour-coded type badges, and copy buttons on every card.

**5. Use the output**

Copy the JSON for any artifact using the copy button. The output is structured to match exactly what ServiceNow expects — field names, types, operation names, and role conventions are all correct and ready to implement.

---

## Tips for better output

- **Be specific about roles.** Instead of "admins can do everything", name the roles: "IT managers can approve, employees can only submit their own requests."
- **Mention edge cases.** If a field should be hidden from certain users, or a flow should behave differently above a certain value, include that.
- **Describe the full lifecycle.** For flows especially, walk through what happens from start to finish, including rejections and errors.
- **Generate in order.** Start with Tables, then Flows (which reference your tables), then Catalog (which triggers your flows), then ACLs (which protect your tables and fields).
- **Iterate.** If the first output isn't quite right, refine your requirements and generate again. Small changes in wording can produce meaningfully different output.

---

## What it's not

SN Toolkit generates the configuration — it does not deploy anything to your instance automatically. Think of it as a senior ServiceNow architect reviewing your requirements and handing you a complete technical spec, which you then implement. The output is a starting point, not a black box.

---

## Built for ServiceNow developers

Whether you're a platform developer translating business requirements, an admin building out a new application, or a student learning ServiceNow development — SN Toolkit removes the blank-canvas problem and gets you to a working implementation faster.