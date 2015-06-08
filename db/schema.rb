# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150607211127) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "memberships", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "repository_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  add_index "memberships", ["repository_id"], name: "index_memberships_on_repository_id", using: :btree
  add_index "memberships", ["user_id"], name: "index_memberships_on_user_id", using: :btree

  create_table "offenses", force: :cascade do |t|
    t.integer  "file_id"
    t.string   "message"
    t.integer  "line"
    t.integer  "column"
    t.integer  "length"
    t.integer  "severity"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "offenses", ["file_id"], name: "index_offenses_on_file_id", using: :btree

  create_table "repositories", force: :cascade do |t|
    t.string   "name"
    t.string   "url"
    t.boolean  "enabled",      default: false
    t.datetime "last_sync_at"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
  end

  create_table "revision_files", force: :cascade do |t|
    t.integer  "revision_id"
    t.string   "path"
    t.integer  "offense_count"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  add_index "revision_files", ["revision_id"], name: "index_revision_files_on_revision_id", using: :btree

  create_table "revisions", force: :cascade do |t|
    t.integer  "repository_id"
    t.string   "sha"
    t.integer  "order"
    t.string   "message"
    t.datetime "date"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  add_index "revisions", ["repository_id"], name: "index_revisions_on_repository_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "uid"
    t.string   "username"
    t.string   "provider"
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  add_foreign_key "memberships", "repositories"
  add_foreign_key "memberships", "users"
  add_foreign_key "revision_files", "revisions"
  add_foreign_key "revisions", "repositories"
end
