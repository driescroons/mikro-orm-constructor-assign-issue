'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const Migration = require('@mikro-orm/migrations').Migration;

class Migration20210519202751 extends Migration {

  async up() {
    this.addSql('create table "form" ("id" uuid not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "title" varchar(255) not null);');
    this.addSql('alter table "form" add constraint "form_pkey" primary key ("id");');

    this.addSql('create table "question" ("id" uuid not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "form_id" uuid not null, "label" varchar(255) not null);');
    this.addSql('alter table "question" add constraint "question_pkey" primary key ("id");');

    this.addSql('create table "option" ("id" uuid not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "question_id" uuid not null, "label" varchar(255) not null);');
    this.addSql('alter table "option" add constraint "option_pkey" primary key ("id");');

    this.addSql('alter table "question" add constraint "question_form_id_foreign" foreign key ("form_id") references "form" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "option" add constraint "option_question_id_foreign" foreign key ("question_id") references "question" ("id") on update cascade on delete CASCADE;');
  }

}
exports.Migration20210519202751 = Migration20210519202751;
