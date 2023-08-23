# Generated by Django 4.2.3 on 2023-08-23 06:23
import uuid
from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('db', '0041_cycle_sort_order_issuecomment_access_and_more'),
    ]

    operations = [
        migrations.RenameModel('IssueProperty', 'IssueDisplayProperty'),
        migrations.AlterModelOptions(
            name='issuedisplayproperty',
            options={'ordering': ('-created_at',), 'verbose_name': 'Issue Display Property', 'verbose_name_plural': 'Issue Display Properties'},
        ),
        migrations.AlterModelTable(
            name='issuedisplayproperty',
            table='issue_display_properties',
        ),
        migrations.CreateModel(
            name='IssueProperty',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Last Modified At')),
                ('id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('type', models.CharField(choices=[('entity', 'entity'), ('text', 'text'), ('number', 'number'), ('checkbox', 'checkbox'), ('select', 'select'), ('mselect', 'mselect'), ('date', 'date'), ('relation', 'relation'), ('files', 'files'), ('email', 'email'), ('url', 'url'), ('timestamp', 'timestamp')])),
                ('is_required', models.BooleanField(default=False)),
                ('sort_order', models.FloatField(default=65535)),
                ('default_value', models.CharField(blank=True, max_length=800, null=True)),
                ('is_shared', models.BooleanField(default=True)),
                ('extra_settings', models.JSONField(blank=True, default=None, null=True)),
                ('unit', models.CharField(blank=True, max_length=100, null=True)),
                ('is_multi', models.BooleanField(default=False)),
                ('is_default', models.BooleanField(default=False)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(class)s_created_by', to=settings.AUTH_USER_MODEL, verbose_name='Created By')),
                ('parent', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='db.issueproperty')),
            ],
            options={
                'verbose_name': 'IssueProperty',
                'verbose_name_plural': 'IssueProperties',
                'db_table': 'issue_properties',
                'ordering': ('sort_order',),
            },
        ),
        migrations.CreateModel(
            name='IssuePropertyValue',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Last Modified At')),
                ('id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('values', models.TextField(blank=True, null=True)),
                ('values_uuid', models.TextField(blank=True, null=True)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(class)s_created_by', to=settings.AUTH_USER_MODEL, verbose_name='Created By')),
                ('issue', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attribute_values', to='db.issue')),
                ('issue_property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='property_values', to='db.issueproperty')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='project_%(class)s', to='db.project')),
                ('updated_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(class)s_updated_by', to=settings.AUTH_USER_MODEL, verbose_name='Last Modified By')),
                ('workspace', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='workspace_%(class)s', to='db.workspace')),
            ],
            options={
                'verbose_name': 'IssuePropertyValue',
                'verbose_name_plural': 'IssuePropertyValues',
                'db_table': 'issue_property_values',
            },
        ),
        migrations.AddField(
            model_name='issueproperty',
            name='project',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='issue_properties', to='db.project'),
        ),
        migrations.AddField(
            model_name='issueproperty',
            name='updated_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='%(class)s_updated_by', to=settings.AUTH_USER_MODEL, verbose_name='Last Modified By'),
        ),
        migrations.AddField(
            model_name='issueproperty',
            name='workspace',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='issue_properties', to='db.workspace'),
        ),
    ]
