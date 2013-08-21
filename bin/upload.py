#!/usr/bin/env python

# NOTE: This script uses Python 2 since the AWS boto library doesn't support python3.

#import argparse
import hashlib
import os
import sys

import boto

BUILD_DIR="dist"

def error_and_exit(msg):
    print(msg)
    sys.exit()

if len(sys.argv) < 2:
    error_and_exit("which bucket?")

bucket_type = sys.argv[1]
if bucket_type == "beta":
    bucket_name = "beta.bauble.io"
elif bucket_type == "production":
    bucket_name = "bauble.io"
else:
    error_and_exit("unknown bucket: " + bucket_type)


s3 = boto.connect_s3()
bucket = s3.get_bucket(bucket_name)
#keys = bucket.get_all_keys()
keys = [key for key in bucket.list()]
key_map = { key.name.encode(): key for key in keys } # map of keys by their names
local_files = set()
for path, subdirs, filenames in os.walk(BUILD_DIR):
    basepath = path[len(BUILD_DIR)+1:]
    local_files.update([os.path.join(basepath, filename) for filename in filenames])

missing_files = local_files.difference(key_map.keys())

print("{total} missing.".format(total=len(missing_files)))

# upload all missing files
for missing in missing_files:
    new_key = boto.s3.key.Key(bucket, missing)
    print("uploading " + new_key.name + "...")
    new_key.set_contents_from_filename(os.path.join(BUILD_DIR, missing))


existing_files = local_files.intersection(key_map.keys())
for existing in existing_files:
    with open(os.path.join(BUILD_DIR, existing)) as local_file:
        local_md5 = hashlib.md5()
        local_md5.update(local_file.read())
        key = key_map[existing]
        # ** NOTE: the etag and md5 might not match if the file was a multipart upload
        # check the md5 against the etag with the quotes stripped
        if local_md5.hexdigest() != key.etag[1:-1]:
            # if key_name[0] == "/":
            #     remote_path = os.path.join(BUILD_DIR, key.name[1:]) # remove leading slash
            # else:
            #remote_path = os.path.join("/", key.name)

            print("updating " + key.name + "...")
            key_md5 = key.get_md5_from_hexdigest(local_md5.hexdigest())
            key.set_contents_from_filename(os.path.join(BUILD_DIR, existing), md5=key_md5)



# delete all files on the server that don't exist locally unless in /font
#files_to_delete = set(key_map.keys()).difference(local_files)
for key_name in set(key_map.keys()).difference(local_files):
    if not key_name.startswith("font/"):
        response = raw_input("delete {}? ".format(key_name))
        if response == 'y':
            print "deleting."
            key_map[key_name].delete()

print("done.")
