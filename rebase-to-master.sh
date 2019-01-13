#!/bin/bash

set -e

if [ "master" != "$(git rev-parse --abbrev-ref HEAD)" ]; then
	echo "ERR: must invoke at master branch."
	exit 1
fi

if [ "" != "$(git diff --stat)" ]; then
	echo "ERR: working copy must be clean."
	exit 1
fi

do_rebase() {
	REBASE_BRANCH=$1
	REBASE_BASE=$2
	echo "rebasing ${REBASE_BRANCH} to ${REBASE_BASE}..."
	sleep 3
	git checkout "${REBASE_BRANCH}"
	git rebase "${REBASE_BASE}" -i
	echo "rebase complete."
}

BASEBRANCH="master"
for NEXTBRANCH in "path-w-app-base-href" "hash-w-app-base-href" "hash-w-empty-app-base-href"; do
	do_rebase "${NEXTBRANCH}" "${BASEBRANCH}"
	BASEBRANCH=$NEXTBRANCH
done

BASEBRANCH="master"
for NEXTBRANCH in "hash-wo-app-base-href" "proposehash-wo-app-base-href" "proposehash-w-app-base-href" "proposehash-w-empty-app-base-href"; do
	do_rebase "${NEXTBRANCH}" "${BASEBRANCH}"
	BASEBRANCH=$NEXTBRANCH
done

git checkout master
