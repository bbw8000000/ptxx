---
title: "paxlabs-inc/machine-genome"
owner: "paxlabs-inc"
name: "machine-genome"
fullName: "paxlabs-inc/machine-genome"
description: "Machine Genome is an open identity and provenance protocol for models, agents, harnesses, datasets, and the artifacts that connect them."
sourceUrl: "https://github.com/paxlabs-inc/machine-genome"
stars: 271
forks: 7
language: "Go"
topics: []
license: "Apache-2.0"
homepage: "https://machinegenome.org/"
defaultBranch: "main"
snapshotDate: "2026-07-21"
pushedAt: "2026-07-20T13:25:58Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Machine Genome

*图片：Conformance*
*图片：CodeQL*
[*图片：Go Reference*](https://pkg.go.dev/github.com/paxlabs-inc/machine-genome)
*图片：License: Apache-2.0*
*图片：Protocol: experimental*

Machine Genome is an open identity and provenance protocol for models, agents,
harnesses, datasets, and the artifacts that connect them. Every immutable,
signed genesis record receives a content-addressed **Gene**. Genes form a
verifiable lineage graph; later amendments and third-party attestations add
evidence without rewriting history.

**Live registry:** [machinegenome.org](https://machinegenome.org) ·
**Protocol:** MGS 0.1.1 implementation profile ·
**API:** OpenAPI 3.1

> [!IMPORTANT]
> MGS is an experimental interoperability profile and this repository is one
> reference implementation. A record proves who signed a claim and what bytes
> were committed; it does not prove inherited capability, consciousness,
> ownership, vendor endorsement, or legal status.

## Why this exists

Modern agents are assembled from model weights, prompts, scaffolds, tools,
datasets, and runtime policy. Names alone cannot answer which exact components
were used, who asserted the relationship, or whether the evidence changed.
Machine Genome provides:

- **stable identity** — a Gene is a SHA-256 multihash of a secured canonical
  genesis record;
- **explicit lineage** — typed parent edges distinguish authorized,
  operator-observed, and unresolved relationships;
- **cryptographic accountability** — W3C `eddsa-jcs-2022` proofs bind records
  to controller DIDs;
- **append-only evolution** — ordered amendments and independent attestations
  add history without mutating genesis;
- **public transparency** — registries provide canonical bytes, inclusion and
  consistency proofs, signed checkpoints, conflict evidence, and tombstones.

The implementation has no dependency on a blockchain, a specific model vendor,
Prometheus, Matrix, or a proprietary DID resolver. The current profile resolves
Ed25519 `did:key` identities offline.

## What is included

| Area | Deliverable |
| --- | --- |
| Protocol | Byte-exact MGS `0.1.1` implementation profile and audit trail |
| Go library | Strict JCS, multihash Genes, Data Integrity, lineage, amendments, attestations |
| Registry | ACID storage, verified admission, DNS namespace control, Merkle log, audit chain |
| Explorer | Responsive, plain-language identity, lineage, artifact, and proof views |
| CLI | Key generation, authoring, signing, verification, digest, backup, and integrity tools |
| Contracts | JSON Schemas, OpenAPI 3.1 document, and machine-readable conformance vectors |
| Operations | Hardened systemd, nginx/Cloudflare, container, backup, restore, and monitoring assets |

See project status for the precise implemented, validated, and
deferred boundaries.

## Quick start

Requirements: Go 1.24 or newer, GNU Make, and `jq`.

```sh
git clone https://github.com/paxlabs-inc/machine-genome.git
cd machine-genome
make check build

bin/mgs keygen --out controller.key.json
bin/mgs init-genesis \
  --key controller.key.json \
  --name cody \
  --namespace example.org \
  --subject-type agent \
  --version 1.0.0 \
  --out genesis.unsigned.json
bin/mgs sign \
  --in genesis.unsigned.json \
  --key controller.key.json \
  --out genesis.json
bin/mgs verify --in genesis.json
bin/mgs gene --in genesis.json
```

Private key files are created with mode `0600`. Never commit keys, registry
tokens, or private evidence.

### Run a local registry

```sh
bin/mgs keygen --out registry-checkpoint.key.json
umask 077
openssl rand -hex 32 > admin.token

bin/mgs registry-serve \
  --data-dir ./registry-data \
  --checkpoint-key registry-checkpoint.key.json \
  --admin-token-file admin.token \
  --listen 127.0.0.1:8080 \
  --public-base-url http://127.0.0.1:8080
```

Open . DNS namespaces must complete the registry's
`dns-01` controller challenge before their first genesis is admitted. DID
namespaces are accepted when the namespace equals the signing controller DID.
`--allow-unverified-namespaces` is for isolated development only.

For a production deployment, follow the
operations runbook and
deployment asset guide.

## Architecture at a glance

```text
authoring CLI / library
        │ secured MGS records
        ▼
  verification boundary ── strict JSON + JCS + DID + signature + lineage
        │ admitted canonical bytes
        ▼
 ACID object store ── indexes ── append-only Merkle log ── signed checkpoint
        │                         │
        ├── HTTP API              └── inclusion / consistency proofs
        └── provenance explorer
```

The shared admission boundary is `registry.Store.Submit`; the HTTP service
cannot bypass record verification. Read the full
architecture and threat model
before extending trust or resolver behavior.

## Documentation

- Documentation index
- Concepts and trust semantics
- Protocol implementation profile
- Protocol audit
- Registry HTTP API and OpenAPI
- CLI reference
- Architecture
- Threat model
- Conformance and test vectors
- Production operations
- Public registry policy
- Versioning and compatibility
- Governance, security, and
  contributing
- Roadmap

## Development

```sh
make help
make check       # tests, vet, schemas, API contract, docs, records
make race        # race detector
make coverage    # HTML and textual coverage report
make build       # static local binary
make dist        # release archives and checksums
```

CI repeats the conformance, race, build, record, repository, and vulnerability
scans on every change. Tagged releases are built from a clean tree with
checksums and a software bill of materials.

## Security and trust

Do not report security vulnerabilities in a public issue. Follow
SECURITY.md to use GitHub's private vulnerability reporting.
Cryptographic review, privacy review, independent witnesses, checkpoint gossip,
federation, and neutral standards governance remain explicit roadmap work.

## License

The Go implementation and repository tooling are licensed under
Apache-2.0. Protocol and explanatory documentation are made
available under CC BY 4.0. Signed registry records do
not grant rights in the external models, source repositories, datasets, or
artifacts they reference. See NOTICE for provenance and attribution.
