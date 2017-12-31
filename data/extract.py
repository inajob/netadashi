import csv
import json

out = [];
with open('all.list', 'r') as f:
  reader = csv.reader(f)
  for row in reader:
    # print "==="
    # print row[1] # title
    # print row[2] # desc
    # print "==="
    out.append({"title": row[1], "desc": row[2]});
print json.dumps(out);
