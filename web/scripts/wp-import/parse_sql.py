import sys, re, json

src, out = sys.argv[1], sys.argv[2]
WANT = {"wpfy_posts", "wpfy_postmeta", "wpfy_terms", "wpfy_term_taxonomy",
        "wpfy_term_relationships", "wpfy_options", "wpfy_termmeta"}

data = open(src, encoding="utf-8", errors="replace").read()

# column names per table
cols = {}
for m in re.finditer(r"CREATE TABLE `(\w+)` \((.*?)\n\) ENGINE", data, re.S):
    t = m.group(1)
    cols[t] = re.findall(r"^\s+`(\w+)`", m.group(2), re.M)

ESC = {"n": "\n", "r": "\r", "t": "\t", "0": "\0", "Z": "\x1a"}

def parse_values(s, i):
    rows = []
    n = len(s)
    while i < n:
        while s[i] in " \n\r\t,":
            i += 1
        if s[i] == ";":
            return rows, i + 1
        assert s[i] == "(", s[i:i+50]
        i += 1
        row = []
        while True:
            c = s[i]
            if c == "'":
                i += 1
                buf = []
                while True:
                    c = s[i]
                    if c == "\\":
                        nx = s[i+1]
                        buf.append(ESC.get(nx, nx))
                        i += 2
                    elif c == "'":
                        if s[i+1] == "'":
                            buf.append("'"); i += 2
                        else:
                            i += 1; break
                    else:
                        buf.append(c); i += 1
                row.append("".join(buf))
            else:
                j = i
                while s[j] not in ",)":
                    j += 1
                tok = s[i:j].strip()
                row.append(None if tok == "NULL" else tok)
                i = j
            while s[i] in " \n":
                i += 1
            if s[i] == ",":
                i += 1
                continue
            if s[i] == ")":
                i += 1
                break
        rows.append(row)
    return rows, i

result = {}
for m in re.finditer(r"INSERT INTO `(\w+)` VALUES", data):
    t = m.group(1)
    if t not in WANT:
        continue
    rows, _ = parse_values(data, m.end())
    c = cols[t]
    result.setdefault(t, []).extend(dict(zip(c, r)) for r in rows)

json.dump(result, open(out, "w"), ensure_ascii=False)
for t, r in result.items():
    print(t, len(r))
