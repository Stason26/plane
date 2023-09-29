# Generated by Django 4.2.5 on 2023-09-26 10:15

from django.db import migrations


def update_issue_activity(apps, schema_editor):
    IssueActivity = apps.get_model("db", "IssueActivity")
    updated_issue_activity = []
    for obj in IssueActivity.objects.all():
        obj.epoch = int(obj.created_at.timestamp())
        updated_issue_activity.append(obj)
    IssueActivity.objects.bulk_update(
        updated_issue_activity,
        ["epoch"],
        batch_size=10000,
    )

class Migration(migrations.Migration):

    dependencies = [
        ('db', '0045_auto_20230915_0655'),
    ]

    operations = [
         migrations.RunPython(update_issue_activity),
    ]
