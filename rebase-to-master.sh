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
for NEXTBRANCH in "hash-wo-app-base-href" "proposehash-wo-app-base-href" "proposehash-w-app-base-href"; do
	do_rebase "${NEXTBRANCH}" "${BASEBRANCH}"
	BASEBRANCH=$NEXTBRANCH
done

BASEBRANCH="proposehash-w-app-base-href"
for COMPATBRANCH in "proposehash-w-empty-app-base-href" "proposehash-w-app-base-href-ngjs-compat" "proposehash-w-app-base-href-fragprefix"; do
	do_rebase "${COMPATBRANCH}" "${BASEBRANCH}"
done

BASEBRANCH="hash-wo-app-base-href"
for NEXTBRANCH in "proposehash2-wo-app-base-href" "proposehash2-w-app-base-href" "proposehash2-w-empty-app-base-href"; do
	do_rebase "${NEXTBRANCH}" "${BASEBRANCH}"
	BASEBRANCH=$NEXTBRANCH
done

git checkout master
