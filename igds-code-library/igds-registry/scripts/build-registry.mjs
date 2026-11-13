#!/usr/bin/env node
/**
 * igds-registry / build-registry.mjs  (TypeScript Compiler API edition, rev. 3)
 *
 * Scans the INSTALLED @igds/core-web + @igds/tokens packages and produces a
 * machine-readable, code-derived component registry — automatically, for
 * ALL exported modules, driven by package.json "exports" + the compiler's
 * own symbol/type resolution (never a hand-picked component list).
 *
 * Identity & inheritance:
 *   - Classes are identified by their ts.Symbol + the relative source file
 *     path that declares them, never by bare class-name string alone, so
 *     two unrelated classes that happen to share a name cannot collide or
 *     overwrite each other's data.
 *   - Inheritance is resolved via `checker.getPropertiesOfType()` (flattens
 *     the whole extends chain) and, for the dedicated AngularFormElement
 *     check, via `type.getBaseTypes()` walked by SYMBOL IDENTITY against a
 *     single canonical anchor symbol — never by comparing extends-clause
 *     text.
 *
 * API surface classification (four independent axes, not one @property bool):
 *   - isJsProperty           — any Lit-reactive field (@property/@state/@query/@queryAll)
 *   - isHtmlAttribute        — only @property AND not explicitly {attribute:false}
 *   - isConsumerConfigurable — only @property: meant for external configuration
 *   - isInternalField        — public TS field/accessor with NO Lit decorator at all
 *   Public methods split into `litLifecycleMethods` vs `publicApiMethods`.
 *
 * Verification — separate status per domain, no blanket flag:
 *   verification.api / .events / .slots / .figmaConformance, each with its
 *   OWN status. figmaConformance is always explicitly "not-checked" here.
 *
 * Extraction-failure self-checks (machinery-level, not just data-quality):
 *   - a second lightweight ts.Program (allowJs) parses every compiled .js
 *     file and surfaces real syntax diagnostics;
 *   - every tagged component's expected .js file must contain >=1
 *     `__decorate` call — zero is flagged as suspicious;
 *   - components with zero extracted fields AND zero methods are flagged.
 *
 * Reads ONLY the published files of @igds/core-web / @igds/tokens. Never
 * writes to node_modules; never modifies IGDS source, project styles,
 * sketches, or the demo form.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = process.env.IGDS_PROJECT_ROOT ? path.resolve(process.env.IGDS_PROJECT_ROOT) : path.resolve(__dirname, '..', '..');
const coreWebRoot = path.join(projectRoot, 'node_modules', '@igds', 'core-web');
const tokensRoot = path.join(projectRoot, 'node_modules', '@igds', 'tokens');
const registryRoot = path.resolve(__dirname, '..');
const libRoot = path.join(coreWebRoot, 'lib');

if (!fs.existsSync(coreWebRoot) || !fs.existsSync(tokensRoot)) {
  console.error('ERROR: @igds/core-web or @igds/tokens not found under node_modules. Run npm install first.');
  process.exit(1);
}

const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const readText = (p) => fs.readFileSync(p, 'utf8');
// rev. 3: Lit's default attribute name is the LOWERCASED property name (helpText -> "helptext"),
// NOT kebab-case. Verified in installed @lit/reactive-element: `"string"==typeof t?t.toLowerCase()`.
// rev. 2 used kebab-case and produced 28 attribute names that silently do nothing.
const litDefaultAttributeName = (name) => name.toLowerCase();
const rel = (p) => path.relative(coreWebRoot, p).split(path.sep).join('/');
// rev. 3: ts.SourceFile.fileName always uses forward slashes, while fs/path on
// Windows produce backslashes. Every map key that mixes the two MUST go through
// norm(), otherwise lookups silently miss (rev. 2 lost every JS-derived tag/event).
const norm = (p) => path.resolve(p);
const isInsideLib = (p) => norm(p).startsWith(norm(libRoot) + path.sep);
function walk(dir, exts, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = norm(path.join(dir, entry.name));
    if (entry.isDirectory()) walk(full, exts, acc);
    else if (exts.some((e) => entry.name.endsWith(e))) acc.push(full);
  }
  return acc;
}

const corePkg = readJSON(path.join(coreWebRoot, 'package.json'));
const tokensPkg = readJSON(path.join(tokensRoot, 'package.json'));
const typescriptPkg = readJSON(path.join(projectRoot, 'node_modules', 'typescript', 'package.json'));

const allDtsFiles = walk(libRoot, ['.d.ts']);
const allJsFiles = walk(libRoot, ['.js']).filter((f) => !f.endsWith('.min.js'));

function readAllEnumsFromFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const src = readText(filePath);
  const sf = ts.createSourceFile(filePath, src, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);
  const enums = [];
  function visit(node) {
    if (ts.isEnumDeclaration(node)) {
      const members = node.members.map((m) => {
        const isLiteral = !!(m.initializer && ts.isStringLiteralLike(m.initializer));
        return { member: m.name.getText(), value: isLiteral ? m.initializer.text : null, valueConfidence: isLiteral ? 'verified' : 'unresolved-non-literal-initializer' };
      });
      enums.push({ name: node.name.text, members });
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  return enums;
}

const tagsEnums = readAllEnumsFromFile(path.join(libRoot, 'constants', 'tags.d.ts'));
const tagsMap = Object.fromEntries((tagsEnums.find((e) => e.name === 'IGDS_TAGS')?.members ?? []).map((m) => [m.member, m.value]));
const eventsEnums = readAllEnumsFromFile(path.join(libRoot, 'constants', 'events.d.ts'));
const eventsMap = Object.fromEntries((eventsEnums.find((e) => e.name === 'IGDS_EVENTS')?.members ?? []).map((m) => [m.member, m.value]));
const globalEventsRegistry = eventsEnums.find((e) => e.name === 'IGDS_EVENTS')?.members ?? [];

const LIT_LIFECYCLE_METHODS = new Set([
  'render', 'update', 'updated', 'firstUpdated', 'willUpdate', 'shouldUpdate',
  'connectedCallback', 'disconnectedCallback', 'attributeChangedCallback',
  'createRenderRoot', 'performUpdate', 'requestUpdate', 'scheduleUpdate', 'getUpdateComplete',
]);

const LIT_REACTIVE_DECORATORS = new Set(['property', 'state', 'query', 'queryAll', 'queryAsync', 'queryAssignedElements', 'queryAssignedNodes']);

const classInfoFromJs = new Map();
const filesWithAnyDecorateCall = new Set();
function jsKey(filePath, className) { return `${norm(filePath)}::${className}`; }
function jsEntry(filePath, className) {
  const k = jsKey(filePath, className);
  if (!classInfoFromJs.has(k)) classInfoFromJs.set(k, { filePath, className, tag: null, tagSource: null, members: new Map(), events: new Set(), eventTemplates: new Set(), slots: new Map() });
  return classInfoFromJs.get(k);
}
// <slot> elements inside lit html`` templates of a class body (static scan).
function collectSlots(classNode, entry) {
  const text = classNode.getText();
  for (const m of text.matchAll(/<slot\b([^>]*)>/g)) {
    const nameMatch = m[1].match(/\bname\s*=\s*["']([^"']+)["']/);
    const dynamicName = /\bname\s*=\s*\$\{/.test(m[1]);
    const key = nameMatch ? nameMatch[1] : dynamicName ? '(dynamic name)' : '(default)';
    const prev = entry.slots.get(key) ?? { name: key, occurrences: 0, hasSlotchangeHandler: false };
    prev.occurrences += 1;
    prev.hasSlotchangeHandler ||= /@slotchange/.test(m[1]);
    entry.slots.set(key, prev);
  }
}
function literalOrIdentifierText(node) {
  if (!node) return undefined;
  if (ts.isStringLiteralLike(node)) return node.text;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  return node.getText();
}

for (const file of allJsFiles) {
  const src = readText(file);
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.ES2022, true, ts.ScriptKind.JS);

  function visit(node, currentClassName) {
    let nextClassName = currentClassName;
    if (ts.isClassLike(node) && node.name) {
      nextClassName = node.name.text;
      collectSlots(node, jsEntry(file, nextClassName));
    }

    // this.dispatchEvent(new CustomEvent(`${x}Change`, ...)) — template-literal event names
    if (
      currentClassName &&
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === 'dispatchEvent' &&
      node.expression.expression.kind === ts.SyntaxKind.ThisKeyword &&
      node.arguments[0] && ts.isNewExpression(node.arguments[0]) &&
      node.arguments[0].expression.getText() === 'CustomEvent'
    ) {
      const nameArg = node.arguments[0].arguments?.[0];
      if (nameArg && ts.isStringLiteralLike(nameArg)) jsEntry(file, currentClassName).events.add(nameArg.text);
      else if (nameArg && ts.isTemplateExpression(nameArg)) jsEntry(file, currentClassName).eventTemplates.add(nameArg.getText());
    }

    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === '__decorate') {
      filesWithAnyDecorateCall.add(file);
      const [decoratorsArrayArg, targetArg, keyArg] = node.arguments;
      if (decoratorsArrayArg && ts.isArrayLiteralExpression(decoratorsArrayArg)) {
        const decoratorCalls = decoratorsArrayArg.elements.map((el) =>
          ts.isCallExpression(el) ? { name: el.expression.getText(), args: el.arguments } : { name: el.getText(), args: [] }
        );
        let className = null;
        if (targetArg) {
          if (ts.isPropertyAccessExpression(targetArg) && targetArg.name.getText() === 'prototype') className = targetArg.expression.getText();
          else if (ts.isIdentifier(targetArg)) className = targetArg.getText();
        }
        if (className) {
          const entry = jsEntry(file, className);
          if (keyArg && ts.isStringLiteralLike(keyArg)) {
            const propName = keyArg.text;
            for (const dc of decoratorCalls) {
              if (LIT_REACTIVE_DECORATORS.has(dc.name)) {
                const optionsArg = dc.args[0];
                let options = null;
                if (optionsArg && ts.isObjectLiteralExpression(optionsArg)) {
                  options = {};
                  for (const p of optionsArg.properties) {
                    if (ts.isPropertyAssignment(p) && ts.isIdentifier(p.name)) options[p.name.text] = literalOrIdentifierText(p.initializer);
                  }
                } else if (optionsArg) {
                  options = { selector: optionsArg.getText() };
                }
                entry.members.set(propName, { decoratorKind: dc.name, options });
              }
            }
          } else {
            for (const dc of decoratorCalls) {
              if (dc.name === 'customElement') {
                let tagValue = literalOrIdentifierText(dc.args[0]);
                let tagSource = 'customElement-decorator-literal';
                if (typeof tagValue === 'string' && tagValue.startsWith('IGDS_TAGS.')) {
                  const member = tagValue.split('.')[1];
                  tagValue = tagsMap[member] ?? null;
                  tagSource = tagValue ? 'customElement-decorator+IGDS_TAGS-enum' : 'customElement-decorator-unresolved-enum-member';
                }
                entry.tag = tagValue;
                entry.tagSource = tagSource;
              }
            }
          }
        }
      }
    }

    if (
      currentClassName &&
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === 'emit' &&
      node.expression.expression.kind === ts.SyntaxKind.ThisKeyword
    ) {
      const arg0 = node.arguments[0];
      let eventValue = null;
      if (arg0) {
        if (ts.isPropertyAccessExpression(arg0) && ts.isIdentifier(arg0.expression) && arg0.expression.text === 'IGDS_EVENTS') {
          eventValue = eventsMap[arg0.name.text] ?? null;
        } else if (ts.isStringLiteralLike(arg0)) {
          eventValue = arg0.text;
        }
      }
      const entry = jsEntry(file, currentClassName);
      if (eventValue) {
        entry.events.add(eventValue);
        // detail = { value: <arg1>, ...<arg2> } (IGDSElement.emit). Record the raw expressions.
        if (!entry.eventDetails) entry.eventDetails = new Map();
        const d = entry.eventDetails.get(eventValue) ?? { valueExpressions: new Set(), customOptionKeys: new Set() };
        if (node.arguments[1]) d.valueExpressions.add(node.arguments[1].getText().replace(/\s+/g, ' ').slice(0, 120));
        else d.valueExpressions.add('(undefined)');
        const opts = node.arguments[2];
        if (opts && ts.isObjectLiteralExpression(opts)) for (const p of opts.properties) if (p.name) d.customOptionKeys.add(p.name.getText());
        entry.eventDetails.set(eventValue, d);
      } else if (arg0) {
        (entry.unresolvedEmits ??= []).push(arg0.getText());
      }
    }

    ts.forEachChild(node, (child) => visit(child, nextClassName));
  }
  visit(sf, null);
}

const jsProgramForDiagnostics = ts.createProgram({
  rootNames: allJsFiles,
  options: {
    allowJs: true, checkJs: false, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler, skipLibCheck: true, noEmit: true,
  },
});
const jsSyntaxDiagnostics = [];
for (const file of allJsFiles) {
  const sf = jsProgramForDiagnostics.getSourceFile(file);
  if (!sf) { jsSyntaxDiagnostics.push({ file: rel(file), message: 'file not resolvable by ts.Program — possible extraction gap' }); continue; }
  for (const d of jsProgramForDiagnostics.getSyntacticDiagnostics(sf)) {
    jsSyntaxDiagnostics.push({ file: rel(file), message: ts.flattenDiagnosticMessageText(d.messageText, ' ') });
  }
}

const compilerOptions = {
  target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler,
  lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'], skipLibCheck: true, allowJs: false, declaration: true, strict: false,
};
const program = ts.createProgram({ rootNames: allDtsFiles, options: compilerOptions });
const checker = program.getTypeChecker();
const rootFileSet = new Set(allDtsFiles.map((f) => path.resolve(f)));

const dtsDiagnostics = [];
for (const sf of program.getSourceFiles()) {
  if (!rootFileSet.has(path.resolve(sf.fileName))) continue;
  for (const d of [...program.getSyntacticDiagnostics(sf), ...program.getSemanticDiagnostics(sf)]) {
    dtsDiagnostics.push({ file: rel(sf.fileName), message: ts.flattenDiagnosticMessageText(d.messageText, ' '), category: ts.DiagnosticCategory[d.category] });
  }
}

const classBySymbol = new Map();

for (const sf of program.getSourceFiles()) {
  if (!rootFileSet.has(path.resolve(sf.fileName))) continue;

  function visitTop(node) {
    if (ts.isClassDeclaration(node) && node.name) {
      const isDeclare = (node.modifiers || []).some((m) => m.kind === ts.SyntaxKind.DeclareKeyword);
      if (isDeclare) {
        const symbol = checker.getSymbolAtLocation(node.name);
        if (symbol) {
          const heritage = node.heritageClauses?.find((h) => h.token === ts.SyntaxKind.ExtendsKeyword);
          const extendsExpr = heritage?.types?.[0]?.expression ?? null;
          classBySymbol.set(symbol, { symbol, node, sourceFile: sf, className: node.name.text, extendsExpr, fields: [], methods: [], tagFromDts: null });
        }
      }
    }
    ts.forEachChild(node, visitTop);
  }
  visitTop(sf);

  function visitTagMap(node) {
    if (ts.isModuleDeclaration(node) && node.name.getText() === 'global' && node.body) {
      ts.forEachChild(node.body, (inner) => {
        if (ts.isInterfaceDeclaration(inner) && inner.name.text === 'HTMLElementTagNameMap') {
          for (const member of inner.members) {
            if (!ts.isPropertySignature(member)) continue;
            let tagLiteral = null;
            if (member.name && ts.isComputedPropertyName(member.name)) {
              const expr = member.name.expression;
              if (ts.isPropertyAccessExpression(expr) && ts.isIdentifier(expr.expression) && expr.expression.text === 'IGDS_TAGS') {
                tagLiteral = tagsMap[expr.name.text] ?? null;
              }
            } else if (member.name && ts.isStringLiteral(member.name)) {
              tagLiteral = member.name.text;
            }
            if (tagLiteral && member.type && ts.isTypeReferenceNode(member.type)) {
              const refSymbol = checker.getSymbolAtLocation(member.type.typeName);
              const resolved = refSymbol ? [...classBySymbol.keys()].find((s) => s === refSymbol || s.name === refSymbol.name) : null;
              if (resolved) classBySymbol.get(resolved).tagFromDts = tagLiteral;
            }
          }
        }
      });
    }
    ts.forEachChild(node, visitTagMap);
  }
  visitTagMap(sf);
}

function getDeclaringClassSymbol(propSymbol) {
  const decl = propSymbol.valueDeclaration || propSymbol.declarations?.[0];
  if (!decl) return null;
  let p = decl.parent;
  while (p && !ts.isClassDeclaration(p)) p = p.parent;
  if (!p || !p.name) return null;
  return checker.getSymbolAtLocation(p.name) ?? null;
}
function isMethodLikeDecl(decl) { return !!decl && (ts.isMethodSignature(decl) || ts.isMethodDeclaration(decl)); }

for (const [symbol, info] of classBySymbol) {
  const instanceType = checker.getDeclaredTypeOfSymbol(symbol);
  const allProps = checker.getPropertiesOfType(instanceType);
  info.platformInheritedOmitted = { fields: 0, methods: 0, declaredIn: new Set() };
  for (const propSymbol of allProps) {
    const decl = propSymbol.valueDeclaration || propSymbol.declarations?.[0];
    const modifierFlags = decl ? ts.getCombinedModifierFlags(decl) : 0;
    if (modifierFlags & ts.ModifierFlags.Private) continue;
    if (modifierFlags & ts.ModifierFlags.Protected) continue;

    // rev. 3: members declared OUTSIDE @igds/core-web/lib (HTMLElement, LitElement,
    // ReactiveElement, lib.dom…) are platform API, not IGDS API. rev. 2 listed
    // ~250 of them per component (15 MB output). Count them, don't list them.
    if (decl && !isInsideLib(decl.getSourceFile().fileName)) {
      if (isMethodLikeDecl(decl)) info.platformInheritedOmitted.methods++; else info.platformInheritedOmitted.fields++;
      const pkgMatch = norm(decl.getSourceFile().fileName).split(path.sep).join('/').match(/node_modules\/((?:@[^/]+\/)?[^/]+)/);
      info.platformInheritedOmitted.declaredIn.add(pkgMatch ? pkgMatch[1] : 'other');
      continue;
    }

    if (isMethodLikeDecl(decl)) {
      const declaringSymbol = getDeclaringClassSymbol(propSymbol);
      const declaringInfo = declaringSymbol ? classBySymbol.get(declaringSymbol) : null;
      info.methods.push({
        name: propSymbol.name,
        kind: LIT_LIFECYCLE_METHODS.has(propSymbol.name) ? 'lit-lifecycle' : 'public-api',
        declaredInClassName: declaringInfo?.className ?? info.className,
      });
      continue;
    }

    const declaringSymbol = getDeclaringClassSymbol(propSymbol);
    const declaringInfo = declaringSymbol ? classBySymbol.get(declaringSymbol) : null;
    let typeString = 'unresolved';
    let typeConfidence = 'unresolved-exception-during-checker-call';
    try {
      const t = checker.getTypeOfSymbolAtLocation(propSymbol, decl ?? info.node);
      typeString = checker.typeToString(t, decl, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.NoTypeReduction);
      // rev. 3: expand named aliases/enums of string literals (e.g. "FooterVariants") into their literal values,
      // so allowed values are explicit for the catalog and the linter.
      const parts = t.isUnion() ? t.types : [t];
      const lits = parts.filter((x) => x.isStringLiteral()).map((x) => x.value);
      const rest = parts.filter((x) => !x.isStringLiteral() && !(x.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)));
      if (lits.length > 1 && rest.length === 0 && !/^"/.test(typeString)) typeString = lits.map((v) => JSON.stringify(v)).join(' | ');
      typeConfidence = /\b(any|error)\b/.test(typeString) ? 'partial-contains-any-or-error' : 'verified';
      // the checker prints imported types as import("<absolute path>"): keep it machine-independent (relative to the
      // project root) so generated files carry no local user paths
      const rootFwd = projectRoot.replace(/\\/g, '/');
      typeString = typeString.split(rootFwd + '/').join('').split(projectRoot + path.sep).join('');
    } catch { /* keep unresolved */ }
    const optional = !!(decl && 'questionToken' in decl && decl.questionToken) || !!(propSymbol.flags & ts.SymbolFlags.Optional);

    info.fields.push({
      name: propSymbol.name,
      declaredInClassName: declaringInfo?.className ?? info.className,
      declaredInSourceFile: declaringInfo ? rel(declaringInfo.sourceFile.fileName) : rel(info.sourceFile.fileName),
      ownDeclaration: declaringSymbol === symbol,
      isStatic: !!(modifierFlags & ts.ModifierFlags.Static),
      optional, type: typeString, typeConfidence,
    });
  }
}

const angularFormElementEntry = [...classBySymbol.values()].find((i) => i.className === 'AngularFormElement');
const angularFormElementSymbol = angularFormElementEntry?.symbol ?? null;

function extendsAngularFormElementViaChecker(symbol) {
  if (!angularFormElementSymbol) return false;
  const seen = new Set();
  function walkType(type) {
    const bases = type.getBaseTypes?.() ?? [];
    for (const base of bases) {
      if (!base.symbol || seen.has(base.symbol)) continue;
      seen.add(base.symbol);
      if (base.symbol === angularFormElementSymbol) return true;
      if (walkType(base)) return true;
    }
    return false;
  }
  return walkType(checker.getDeclaredTypeOfSymbol(symbol));
}

function expectedJsPathFor(dtsSourceFile) { return norm(dtsSourceFile.replace(/\.d\.ts$/, '.js')); }

// IGDS base classes (inside lib) of a class, nearest first — resolved by symbol, not by name.
function igdsBaseClassInfos(symbol) {
  const out = [];
  const seen = new Set();
  (function walkType(type) {
    for (const base of type.getBaseTypes?.() ?? []) {
      if (!base.symbol || seen.has(base.symbol)) continue;
      seen.add(base.symbol);
      const bi = classBySymbol.get(base.symbol);
      if (bi) out.push(bi);
      walkType(base);
    }
  })(checker.getDeclaredTypeOfSymbol(symbol));
  return out;
}

// Events dispatched by a class itself + every IGDS base class. Template-literal
// names like `${propertyName}Change` are expanded against the declaring base's
// own @property names (that is how AngularFormElement builds checkedChange/valueChange).
function collectEvents(symbol, info) {
  const result = [];
  const chain = [info, ...igdsBaseClassInfos(symbol)];
  for (const ci of chain) {
    const js = classInfoFromJs.get(jsKey(expectedJsPathFor(ci.sourceFile.fileName), ci.className));
    if (!js) continue;
    const inherited = ci !== info;
    for (const ev of js.events) {
      const d = js.eventDetails?.get(ev);
      result.push({
        name: ev, source: inherited ? `inherited from ${ci.className}` : 'own', confidence: 'verified-literal-or-IGDS_EVENTS-enum',
        dispatch: d ? 'IGDSElement.emit → CustomEvent{bubbles:true, composed:true}' : 'dispatchEvent(new CustomEvent)',
        detail: d ? { shape: '{ value, ...customOptions }', valueExpressions: [...d.valueExpressions], customOptionKeys: [...d.customOptionKeys], confidence: 'raw-source-expressions (not a resolved type)' } : null,
      });
    }
    for (const tpl of js.eventTemplates) {
      const m = tpl.match(/^`\$\{[^}]+\}(\w+)`$/);
      const decorated = [...js.members.entries()].filter(([, v]) => v.decoratorKind === 'property').map(([k]) => k);
      if (m) for (const p of decorated) result.push({ name: `${p}${m[1]}`, source: `${inherited ? `inherited from ${ci.className}` : 'own'} (template ${tpl})`, confidence: 'derived-template-expanded-over-@property-names' });
      else result.push({ name: tpl, source: inherited ? `inherited from ${ci.className}` : 'own', confidence: 'unresolved-template-literal' });
    }
  }
  const dedup = new Map();
  for (const e of result) if (!dedup.has(e.name)) dedup.set(e.name, e);
  return [...dedup.values()].sort((a, b) => a.name.localeCompare(b.name));
}

// ---------- public-method classification (rev. 3) ----------
// TypeScript "public" ≠ consumer API: @igds/core-web marks most helpers public. Classify with
// explicit, documented evidence; never present a method as API without it.
const STANDARD_ELEMENT_METHODS = new Set(['focus', 'blur', 'click', 'checkValidity', 'reportValidity', 'setCustomValidity']);
const INTERNAL_NAME_PATTERN = /^(render|get|handle|on[A-Z]|is[A-Z]|has[A-Z]|process|emit[A-Z]|emit$|init|initialize|update|measure|check(?!Validity)|should|find|pad|generate|listen|prevent|emulate|move[A-Z]|scroll|focus[A-Z]|manage|reportAbout|deactivate|add\w*(Listeners?|Styles\w*)|remove\w*(Listeners?|Class)|set\w*(Position|FormValue|Focused\w*|EventListeners)|setDragging|start\w*Drag|end\w*Drag)|ByBackdropClick$/;
// Simple imperative verbs on the element itself: consumer-facing even when ALSO bound to an internal button.
const IMPERATIVE_VERB = /^(show|hide|open|close|toggle|start|stop|requestOpen|requestClose|clear|reset)$/;
const jsTextCache = new Map();
const jsText = (f) => { if (!jsTextCache.has(f)) jsTextCache.set(f, fs.existsSync(f) ? readText(f) : ''); return jsTextCache.get(f); };
function classifyMethod(m, info) {
  // declaring class = the class in this component's own inheritance chain (resolved by symbol, not global name)
  const declaring = [info, ...igdsBaseClassInfos(info.symbol)].find((c) => c.className === m.declaredInClassName);
  const ownJs = declaring ? expectedJsPathFor(declaring.sourceFile.fileName) : null;
  const esc = m.name.replace(/\$/g, '\\$');
  const calledOnThis = ownJs ? new RegExp(`this\\.${esc}\\b`).test(jsText(ownJs)) : false;
  const usedInTemplateBinding = ownJs ? new RegExp(`@[\\w-]+=\\$\\{[^}]*this\\.${esc}\\b`).test(jsText(ownJs)) : false;
  const otherReceiverCall = new RegExp(`(?<!\\bthis)\\.${esc}\\(`); // x.name( where x is not "this"
  const calledByOtherModules = allJsFiles.filter((f) => f !== ownJs && otherReceiverCall.test(jsText(f))).map(rel);
  let classification, reason;
  if (m.declaredInClassName === 'IGDSElement' && m.name === 'emit') { classification = 'internal-base-helper'; reason = 'IGDSElement.emit dispatches the component\'s own events'; }
  else if (STANDARD_ELEMENT_METHODS.has(m.name)) { classification = 'consumer-api-standard-element'; reason = 'overrides a standard HTMLElement / form-control method'; }
  else if (IMPERATIVE_VERB.test(m.name)) { classification = 'candidate-consumer-api'; reason = 'simple imperative verb on the element (show/hide/open/close…)' + (usedInTemplateBinding ? '; also bound to an internal control' : ''); }
  else if (usedInTemplateBinding) { classification = 'internal-template-handler'; reason = 'bound as an event handler inside the component\'s own lit template'; }
  else if (INTERNAL_NAME_PATTERN.test(m.name)) { classification = 'internal-by-naming-convention'; reason = 'render*/get*/handle*/on*/is*/has*/process*… helper naming'; }
  else { classification = 'candidate-consumer-api'; reason = 'public, not a template handler, not helper-named' + (calledByOtherModules.length ? `; also called by other IGDS modules (${calledByOtherModules.length})` : '') + (calledOnThis ? '; also called internally' : ''); }
  return { name: m.name, declaredInClassName: m.declaredInClassName, classification, classificationConfidence: classification === 'consumer-api-standard-element' ? 'high' : 'heuristic', reason, evidence: { calledOnThisInOwnClass: calledOnThis, usedInTemplateBinding, calledByOtherModules } };
}

function classifyField(f) {
  const declDtsPath = path.resolve(coreWebRoot, f.declaredInSourceFile);
  const expectedJs = expectedJsPathFor(declDtsPath);
  const jsInfo = classInfoFromJs.get(jsKey(expectedJs, f.declaredInClassName));
  const decoInfo = jsInfo?.members.get(f.name) || null;

  const isJsProperty = !!decoInfo;
  const isConsumerConfigurable = decoInfo?.decoratorKind === 'property';
  const attributeExplicitlyDisabled = isConsumerConfigurable && decoInfo.options && decoInfo.options.attribute === false;
  const isHtmlAttribute = isConsumerConfigurable && !attributeExplicitlyDisabled;
  const isInternalField = !isJsProperty;

  return {
    name: f.name, declaredInClassName: f.declaredInClassName, declaredInSourceFile: f.declaredInSourceFile,
    ownDeclaration: f.ownDeclaration, isStatic: f.isStatic, optional: f.optional, type: f.type, typeConfidence: f.typeConfidence,
    decoratorKind: decoInfo?.decoratorKind ?? null, isJsProperty, isHtmlAttribute, isConsumerConfigurable, isInternalField,
    attribute: isHtmlAttribute ? (typeof decoInfo.options?.attribute === 'string' ? decoInfo.options.attribute : litDefaultAttributeName(f.name)) : null,
    attributeConfidence: !isHtmlAttribute ? null : typeof decoInfo.options?.attribute === 'string' ? 'verified-explicit-in-decorator' : 'derived-lit-default-lowercase',
    classificationReason: isConsumerConfigurable
      ? 'has @property decorator — consumer-configurable JS property' + (isHtmlAttribute ? ' with an HTML attribute' : ' (attribute:false — JS-only, no HTML attribute)')
      : isJsProperty
        ? `has @${decoInfo.decoratorKind} decorator — real reactive JS property, but INTERNAL (not consumer-configurable)`
        : f.isStatic
          ? 'static class member (e.g. lit "styles"/"formAssociated") — not an instance property'
          : 'public field/accessor with no Lit decorator found in the compiled .js — likely internal plumbing (e.g. a constructor-assigned DOM reference), not a reactive property at all',
  };
}

const components = [];
const abstractBasesWithNoTag = [];
const extractionSelfCheckIssues = [];

for (const [symbol, info] of classBySymbol) {
  const expectedJs = expectedJsPathFor(info.sourceFile.fileName);
  const jsInfoForTag = classInfoFromJs.get(jsKey(expectedJs, info.className));
  const tagFromJs = jsInfoForTag?.tag ?? null;
  const tagFromDts = info.tagFromDts ?? null;

  let tag = null;
  let tagConfidence;
  if (tagFromJs && tagFromDts) {
    tagConfidence = tagFromJs === tagFromDts ? 'verified-dual-source-agreement' : 'CONFLICT-sources-disagree';
    tag = tagFromJs === tagFromDts ? tagFromJs : `CONFLICT: js=${tagFromJs} dts=${tagFromDts}`;
  } else if (tagFromJs) { tag = tagFromJs; tagConfidence = 'partial-js-decorator-only-no-dts-confirmation'; }
  else if (tagFromDts) { tag = tagFromDts; tagConfidence = 'partial-dts-only-no-js-decorator-confirmation'; }
  else { abstractBasesWithNoTag.push({ className: info.className, sourceFile: rel(info.sourceFile.fileName) }); continue; }

  if (!filesWithAnyDecorateCall.has(expectedJs)) {
    extractionSelfCheckIssues.push({ issue: 'tagged component has zero __decorate calls detected in its expected compiled .js file', component: `${info.className} (${tag})`, expectedJsFile: rel(expectedJs), severity: 'investigate' });
  }

  const classifiedFields = info.fields.map(classifyField);
  const props = classifiedFields.filter((f) => f.isConsumerConfigurable);
  const internalReactiveState = classifiedFields.filter((f) => f.isJsProperty && !f.isConsumerConfigurable);
  const internalPlainFields = classifiedFields.filter((f) => f.isInternalField && !f.isStatic);
  const staticFields = classifiedFields.filter((f) => f.isStatic);
  const litLifecycleMethods = info.methods.filter((m) => m.kind === 'lit-lifecycle').map((m) => m.name);
  const publicApiMethods = info.methods.filter((m) => m.kind === 'public-api').map((m) => classifyMethod(m, info));
  const events = collectEvents(symbol, info);
  const slotChain = [info, ...igdsBaseClassInfos(symbol)];
  const slots = [];
  for (const ci of slotChain) {
    const js = classInfoFromJs.get(jsKey(expectedJsPathFor(ci.sourceFile.fileName), ci.className));
    for (const s of js?.slots.values() ?? []) if (!slots.some((x) => x.name === s.name)) slots.push({ ...s, declaredInClassName: ci.className });
  }

  if (classifiedFields.length === 0 && info.methods.length === 0) {
    extractionSelfCheckIssues.push({ issue: 'tagged component has ZERO fields and ZERO methods extracted — possible total extraction failure for this class', component: `${info.className} (${tag})`, sourceFile: rel(info.sourceFile.fileName), severity: 'review-required' });
  }

  const npmModule = rel(info.sourceFile.fileName).split('/')[1];
  const enumsPath = path.join(libRoot, npmModule, 'constants.d.ts');
  const variantEnums = readAllEnumsFromFile(enumsPath);

  const apiFieldConfidences = [tagConfidence, ...props.map((p) => p.typeConfidence)];
  const apiVerified = apiFieldConfidences.filter((c) => c.startsWith('verified')).length;
  const apiPartial = apiFieldConfidences.filter((c) => c.startsWith('partial')).length;
  const apiUnresolvedOrConflict = apiFieldConfidences.length - apiVerified - apiPartial;

  components.push({
    id: `${npmModule}/${rel(info.sourceFile.fileName).split('/').pop().replace('.d.ts', '')}::${info.className}`,
    npmModule, npmImportPath: `@igds/core-web/${npmModule}`, className: info.className, sourceFile: rel(info.sourceFile.fileName),
    extendsAngularFormElement: extendsAngularFormElementViaChecker(symbol),
    tag, props, internalReactiveState, internalPlainFields, staticFields, litLifecycleMethods, publicApiMethods,
    events,
    slots,
    platformInheritedMembersOmitted: { fields: info.platformInheritedOmitted.fields, methods: info.platformInheritedOmitted.methods, declaredIn: [...info.platformInheritedOmitted.declaredIn].sort() },
    variantEnums,
    verification: {
      tag: { status: tagConfidence, fromJsDecorator: tagFromJs, fromDtsTagMap: tagFromDts },
      api: { status: apiUnresolvedOrConflict > 0 ? 'partial' : apiPartial > 0 ? 'partial' : 'verified', totalFieldsEvaluated: apiFieldConfidences.length, verified: apiVerified, partial: apiPartial, unresolvedOrConflict: apiUnresolvedOrConflict },
      events: { status: jsInfoForTag ? 'extracted-static-scan' : 'not-extracted-no-matching-js-file', note: 'this.emit(...) and this.dispatchEvent(new CustomEvent(...)) call sites in this class and its IGDS base classes. Native events re-dispatched on inner elements (e.g. inner <select> "change") are NOT listed. Event detail payload shape is not extracted.' },
      slots: { status: jsInfoForTag ? 'extracted-static-scan' : 'not-extracted-no-matching-js-file', note: '<slot> elements found in the compiled class body (lit templates). Not runtime-verified; @igds/core-web ships no custom-elements-manifest.' },
      figmaConformance: { status: 'not-checked', reason: 'this script reads only the installed npm package; comparison against the Figma design source is a separate pass, not run here' },
    },
  });
}

const checks = { passed: [], failed: [] };
const check = (name, ok, detail) => (ok ? checks.passed : checks.failed).push({ name, detail });

check('JS AST pass produced zero syntax diagnostics across all compiled .js files', jsSyntaxDiagnostics.length === 0, jsSyntaxDiagnostics);
check('d.ts Program produced zero compiler diagnostics across all scanned files', dtsDiagnostics.length === 0, dtsDiagnostics);
check('no tagged component has a .js file with zero detected __decorate calls', extractionSelfCheckIssues.filter((i) => i.issue.includes('zero __decorate')).length === 0, extractionSelfCheckIssues.filter((i) => i.issue.includes('zero __decorate')));
check('no tagged component has zero extracted fields AND zero methods', extractionSelfCheckIssues.filter((i) => i.issue.includes('ZERO fields')).length === 0, extractionSelfCheckIssues.filter((i) => i.issue.includes('ZERO fields')));

const exportsMap = corePkg.exports || {};
const moduleNames = Object.keys(exportsMap).filter((k) => k !== '.').map((k) => k.replace(/^\.\//, ''));
const NON_COMPONENT_MODULES = new Set(['constants']);
const modulesWithComponents = new Set(components.map((c) => c.npmModule));
const moduleClassification = moduleNames.map((m) => {
  if (NON_COMPONENT_MODULES.has(m)) return { module: m, classification: 'non-component-module (shared enums/tags/events barrel)' };
  if (modulesWithComponents.has(m)) return { module: m, classification: 'ui-component-module', componentCount: components.filter((c) => c.npmModule === m).length };
  return { module: m, classification: 'UNCLASSIFIED — no tagged component found, not whitelisted' };
});
const unclassifiedModules = moduleClassification.filter((m) => m.classification.startsWith('UNCLASSIFIED'));
check('every exported module is classified as ui-component or whitelisted non-component', unclassifiedModules.length === 0, unclassifiedModules);

const tagToComponents = new Map();
for (const c of components) { if (!tagToComponents.has(c.tag)) tagToComponents.set(c.tag, []); tagToComponents.get(c.tag).push(c.id); }
const allKnownTags = Object.values(tagsMap);
const unmatchedTags = allKnownTags.filter((t) => !tagToComponents.has(t));
const ambiguousTags = [...tagToComponents.entries()].filter(([, ids]) => ids.length > 1);
check('every known IGDS_TAGS member matched to a component', unmatchedTags.length === 0, unmatchedTags);
check('no tag matched to more than one component', ambiguousTags.length === 0, ambiguousTags);
check('no tag-source CONFLICT between js decorator and .d.ts tag map', components.every((c) => !String(c.tag).startsWith('CONFLICT')), components.filter((c) => String(c.tag).startsWith('CONFLICT')).map((c) => c.id));

const angularFormComponents = components.filter((c) => c.extendsAngularFormElement);
const checkedValueFailures = [];
for (const c of angularFormComponents) {
  const checkedProp = c.props.find((p) => p.name === 'checked');
  const valueProp = c.props.find((p) => p.name === 'value');
  if (!checkedProp || checkedProp.declaredInClassName !== 'AngularFormElement') checkedValueFailures.push({ component: c.id, missing: 'checked (consumer-configurable, declared in AngularFormElement)', found: checkedProp ?? null });
  if (!valueProp || valueProp.declaredInClassName !== 'AngularFormElement') checkedValueFailures.push({ component: c.id, missing: 'value (consumer-configurable, declared in AngularFormElement)', found: valueProp ?? null });
}
check(`every component extending AngularFormElement (resolved via TypeChecker base-type symbols, ${angularFormComponents.length} found) exposes inherited consumer-configurable "checked" and "value" declared in AngularFormElement`, checkedValueFailures.length === 0, checkedValueFailures);

const overallPassed = checks.failed.length === 0;

const registry = {
  generatedAt: new Date().toISOString(),
  generatedBy: 'igds-registry/scripts/build-registry.mjs (TypeScript Compiler API, rev. 3)',
  dataSource: 'code-only (installed @igds/core-web + @igds/tokens). Figma-derived data is kept in a separate file and never merged here. "figmaConformance" on every component is always explicitly "not-checked".',
  sourcePackages: { '@igds/core-web': corePkg.version, '@igds/tokens': tokensPkg.version, typescript: typescriptPkg.version },
  summary: {
    totalExportedModules: moduleNames.length,
    totalComponentsExtracted: components.length,
    totalAbstractBaseClassesExcluded: abstractBasesWithNoTag.length,
    totalKnownTagsInLibrary: allKnownTags.length,
    tagsMatched: allKnownTags.length - unmatchedTags.length,
    totalConsumerConfigurablePropsExtracted: components.reduce((s, c) => s + c.props.length, 0),
    totalInternalReactiveStateFieldsExtracted: components.reduce((s, c) => s + c.internalReactiveState.length, 0),
    totalInternalPlainFieldsExtracted: components.reduce((s, c) => s + c.internalPlainFields.length, 0),
    totalPublicApiMethodsExtracted: components.reduce((s, c) => s + c.publicApiMethods.length, 0),
    extractionSelfCheckIssues: extractionSelfCheckIssues.length,
    checksPassed: checks.passed.length,
    checksFailed: checks.failed.length,
    overallPassed,
  },
  checks, extractionSelfCheckIssues, moduleClassification, abstractBaseClassesExcluded: abstractBasesWithNoTag,
  allKnownTags: tagsMap, globalEventsRegistry, components,
};

fs.writeFileSync(path.join(registryRoot, 'components.generated.json'), JSON.stringify(registry, null, 2), 'utf8');

const lines = [];
lines.push('# IGDS Registry — Extraction Report (TypeScript Compiler API, rev. 3)');
lines.push('');
lines.push(`Generated: ${registry.generatedAt}`);
lines.push(`@igds/core-web ${corePkg.version} · @igds/tokens ${tokensPkg.version} · typescript ${typescriptPkg.version}`);
lines.push('');
lines.push('## Summary');
for (const [k, v] of Object.entries(registry.summary)) lines.push(`- **${k}**: ${v}`);
lines.push('');
lines.push('## Automated checks — passed');
for (const c of checks.passed) lines.push(`- ✅ ${c.name}`);
lines.push('');
lines.push('## Automated checks — failed');
if (checks.failed.length === 0) lines.push('(none)');
for (const c of checks.failed) { lines.push(`- ❌ ${c.name}`); lines.push('```json'); lines.push(JSON.stringify(c.detail, null, 2)); lines.push('```'); }
lines.push('');
lines.push('## Extraction self-check issues (machinery-level, not data-quality)');
if (extractionSelfCheckIssues.length === 0) lines.push('(none)');
for (const i of extractionSelfCheckIssues) lines.push(`- ⚠️ [${i.severity}] ${i.issue} — ${i.component ?? ''} ${i.expectedJsFile ?? i.sourceFile ?? ''}`);
lines.push('');
lines.push('## Module classification');
lines.push('| module | classification |');
lines.push('|---|---|');
for (const m of moduleClassification) lines.push(`| ${m.module} | ${m.classification}${m.componentCount ? ` (${m.componentCount})` : ''} |`);
lines.push('');
lines.push('## Per-component verification status (api / events / slots / figmaConformance)');
lines.push('| component | tag | api | events | slots | figmaConformance |');
lines.push('|---|---|---|---|---|---|');
for (const c of components) lines.push(`| ${c.id} | \`${c.tag}\` | ${c.verification.api.status} | ${c.verification.events.status} | ${c.verification.slots.status} | ${c.verification.figmaConformance.status} |`);
lines.push('');

fs.writeFileSync(path.join(registryRoot, 'extraction-report.md'), lines.join('\n'), 'utf8');

console.log(`[igds-registry] components extracted: ${components.length}`);
console.log(`[igds-registry] consumer-configurable props: ${registry.summary.totalConsumerConfigurablePropsExtracted}`);
console.log(`[igds-registry] tag coverage: ${registry.summary.tagsMatched}/${registry.summary.totalKnownTagsInLibrary}`);
console.log(`[igds-registry] checks: ${checks.passed.length} passed, ${checks.failed.length} failed`);
console.log(`[igds-registry] extraction self-check issues: ${extractionSelfCheckIssues.length}`);
console.log('[igds-registry] wrote components.generated.json + extraction-report.md');
if (!overallPassed) { console.error('[igds-registry] FAILED — see extraction-report.md for details'); process.exit(1); }
