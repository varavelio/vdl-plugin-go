package main

import (
	"encoding/json"
	"fixture/gen"

	"varavel.com/testutil"
)

func main() {
	var decoded gen.Envelope
	err := json.Unmarshal([]byte(`{
		"direct": {"username": "direct", "password": "secret"},
		"list": [{"username": "list", "password": "secret"}],
		"matrix": [[{"username": "matrix", "password": "secret"}]],
		"lookup": {"primary": {"username": "lookup", "password": "secret"}},
		"buckets": {"ops": [{"username": "bucket", "password": "secret"}]},
		"optDirect": {"username": "optional", "password": "secret"}
	}`), &decoded)
	testutil.MustNoError("strict combinations valid", err)
	testutil.MustEqual("direct username", decoded.Direct.Username, "direct")
	testutil.MustEqual("list username", decoded.List[0].Username, "list")
	testutil.MustEqual("matrix username", decoded.Matrix[0][0].Username, "matrix")
	testutil.MustEqual("lookup username", decoded.Lookup["primary"].Username, "lookup")
	testutil.MustEqual("bucket username", decoded.Buckets["ops"][0].Username, "bucket")
	testutil.MustEqual("optional username", decoded.GetOptDirect().Username, "optional")

	err = json.Unmarshal([]byte(`{
		"direct": {"password": "secret"},
		"list": [{"username": "list", "password": "secret"}],
		"matrix": [[{"username": "matrix", "password": "secret"}]],
		"lookup": {"primary": {"username": "lookup", "password": "secret"}},
		"buckets": {"ops": [{"username": "bucket", "password": "secret"}]}
	}`), &decoded)
	testutil.MustErrContains("strict direct", err, `field direct.username is required`)

	err = json.Unmarshal([]byte(`{
		"direct": {"username": "direct", "password": "secret"},
		"list": [{"username": "list"}],
		"matrix": [[{"username": "matrix", "password": "secret"}]],
		"lookup": {"primary": {"username": "lookup", "password": "secret"}},
		"buckets": {"ops": [{"username": "bucket", "password": "secret"}]}
	}`), &decoded)
	testutil.MustErrContains("strict list", err, `field list[0].password is required`)

	err = json.Unmarshal([]byte(`{
		"direct": {"username": "direct", "password": "secret"},
		"list": [{"username": "list", "password": "secret"}],
		"matrix": [[{"password": "secret"}]],
		"lookup": {"primary": {"username": "lookup", "password": "secret"}},
		"buckets": {"ops": [{"username": "bucket", "password": "secret"}]}
	}`), &decoded)
	testutil.MustErrContains("strict matrix", err, `field matrix[0][0].username is required`)

	err = json.Unmarshal([]byte(`{
		"direct": {"username": "direct", "password": "secret"},
		"list": [{"username": "list", "password": "secret"}],
		"matrix": [[{"username": "matrix", "password": "secret"}]],
		"lookup": {"primary": {"password": "secret"}},
		"buckets": {"ops": [{"username": "bucket", "password": "secret"}]}
	}`), &decoded)
	testutil.MustErrContains("strict lookup", err, `field lookup["primary"].username is required`)

	err = json.Unmarshal([]byte(`{
		"direct": {"username": "direct", "password": "secret"},
		"list": [{"username": "list", "password": "secret"}],
		"matrix": [[{"username": "matrix", "password": "secret"}]],
		"lookup": {"primary": {"username": "lookup", "password": "secret"}},
		"buckets": {"ops": [{"password": "secret"}]}
	}`), &decoded)
	testutil.MustErrContains("strict buckets", err, `field buckets["ops"][0].username is required`)

	err = json.Unmarshal([]byte(`{
		"direct": {"username": "direct", "password": "secret"},
		"list": [{"username": "list", "password": "secret"}],
		"matrix": [[{"username": "matrix", "password": "secret"}]],
		"lookup": {"primary": {"username": "lookup", "password": "secret"}},
		"buckets": {"ops": [{"username": "bucket", "password": "secret"}]},
		"optDirect": {"username": "optional"}
	}`), &decoded)
	testutil.MustErrContains("strict optional object", err, `field optDirect.password is required`)
}
